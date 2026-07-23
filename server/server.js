const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const { getInitialStateByMode } = require('./helpers');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://621d4b59d7bcc84b-95-47-113-228.serveousercontent.com",
            "https://2d9b12e66a94ec39-95-47-113-228.serveousercontent.com",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175"
        ],
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on('connection', (socket) => {

    socket.on('getActiveRooms', () => {
        const activeRooms = Object.keys(rooms).map(roomId => {
            const room = rooms[roomId];
            const activePlayers = room.players.filter(p => !p.disconnected).length;
            const hasDisconnected = room.players.some(p => p.disconnected);
            return {
                roomId,
                roomName: room.roomName,
                playersCount: activePlayers,
                createdAt: room.createdAt || Date.now(),
                gameMode: room.gameMode,
                hasPassword: !!room.password,
                hasDisconnected,
            };
        }).filter(room => room.playersCount === 1 && !room.hasDisconnected);

        socket.emit('activeRooms', activeRooms);
    });

    socket.on('findRoomByName', (roomName) => {
        const trimmedRoomName = roomName && roomName.trim() ? roomName.trim() : null;
        if (!trimmedRoomName) {
            socket.emit('findRoomByNameResponse', { success: false });
            return;
        }

        let foundRoomId = Object.keys(rooms).find((roomId) => {
            const room = rooms[roomId];
            const activePlayers = room.players.filter(p => !p.disconnected).length;
            const hasDisconnected = room.players.some(p => p.disconnected);
            return !hasDisconnected && activePlayers === 1 &&
                room.roomName && room.roomName.trim() === trimmedRoomName;
        });

        if (!foundRoomId) {
            foundRoomId = Object.keys(rooms).find((roomId) => {
                const room = rooms[roomId];
                const activePlayers = room.players.filter(p => !p.disconnected).length;
                const hasDisconnected = room.players.some(p => p.disconnected);
                return !hasDisconnected && activePlayers === 1 && roomId === trimmedRoomName;
            });
        }

        if (foundRoomId) {
            socket.emit('findRoomByNameResponse', {
                success: true,
                roomId: foundRoomId,
            });
        } else {
            socket.emit('findRoomByNameResponse', { success: false });
        }
    });

    socket.on("reconnectGame", ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;

        const player = room.players.find(p => p.disconnected);

        if (player) {
            player.socketId = socket.id;
            player.disconnected = false;

            clearTimeout(room.timeout);

            socket.join(roomId);

            socket.emit("gameInfo", {
                roomId,
                side: player.side,
                playersCount: room.players.filter(p => !p.disconnected).length,
                gameMode: room.gameMode,
            });

            socket.emit('syncGameState', {
                initialState: room.initialState || null,
                moves: room.moves || [],
            });

            io.to(roomId).emit("playerReconnected", {
                playersCount: room.players.filter(p => !p.disconnected).length,
                message: 'The player has been reinstated',
            });

            const activePlayers = room.players.filter(p => !p.disconnected);
            if (activePlayers.length === 2) {
                activePlayers.forEach((player, index) => {
                    const opponent = activePlayers.find(p => p.socketId !== player.socketId);
                    if (!opponent) {
                        console.warn(`Opponent not found for player ${player.socketId} in room ${roomId}`);
                        return;
                    }
                    io.to(player.socketId).emit('playersReady', {
                        playersCount: 2,
                        yourSide: player.side,
                        opponent: { name: opponent.name, avatar: opponent.avatar },
                        message: 'Players ready',
                    });
                });
            }
        }
    });
    socket.on('joinGame', (roomId, gameData = {}, callback) => {
        if (!rooms[roomId]) {
            let initialState = null;
            if (gameData.initialState) {
                initialState = gameData.initialState;
            } else if (gameData.gameMode === 'chess960' || gameData.gameMode === 'shatranj960') {
                initialState = getInitialStateByMode(gameData.gameMode, 8);
            }
            const roomName = gameData.roomName && gameData.roomName.trim()
                ? gameData.roomName.trim()
                : gameData.initialState?.roomName && gameData.initialState.roomName.trim()
                    ? gameData.initialState.roomName.trim()
                    : null;
            rooms[roomId] = {
                players: [],
                createdAt: Date.now(),
                gameMode: gameData.gameMode,
                initialState,
                moves: [],
                roomName,
                whiteTime: gameData.whiteTime,
                blackTime: gameData.blackTime,
                password: gameData.password && gameData.password.trim()
                    ? gameData.password.trim()
                    : null,
            };
        }

        const room = rooms[roomId];
        if (room.password && room.password !== (gameData.password && gameData.password.trim())) {
            if (callback) {
                callback({ success: false, error: 'Неверный пароль для комнаты' });
            }
            return;
        }

        const activePlayerCount = room.players.filter(p => !p.disconnected).length;
        const hasDisconnected = room.players.some(p => p.disconnected);
        if (hasDisconnected || activePlayerCount >= 2) {
            if (callback) {
                callback({ success: false, error: 'Комната временно недоступна или уже заполнена' });
            }
            return;
        }

        socket.join(roomId);

        if (!rooms[roomId].initialState && gameData.initialState) {
            rooms[roomId].initialState = gameData.initialState;
        }

        const side = rooms[roomId].players.length === 0 ? 'white' : 'black';
        rooms[roomId].players.push({ socketId: socket.id, side, disconnected: false, name: gameData.userName, avatar: gameData.userAvatar });

        socket.emit('gameInfo', {
            roomId,
            side,
            playersCount: rooms[roomId].players.length,
            gameMode: rooms[roomId].gameMode,
            roomName: rooms[roomId].roomName || null,
        });

        if (callback) {
            callback({
                success: true,
                roomId,
                initialState: rooms[roomId].initialState || null,
                moves: rooms[roomId].moves || [],
            });
        }

        const activePlayers = rooms[roomId].players.filter(p => !p.disconnected);
        if (activePlayers.length === 2) {
            io.to(roomId).emit('gameInfo', {
                roomId,
                playersCount: 2,
                side: 'both',
                message: 'Both players have joined!',
                gameMode: rooms[roomId].gameMode,
                roomName: rooms[roomId].roomName,
            });

            activePlayers.forEach((player, index) => {
                const opponent = activePlayers.find(p => p.socketId !== player.socketId);
                if (!opponent) {
                    console.warn(`Opponent not found for player ${player.socketId} in room ${roomId}`);
                    return;
                }
                io.to(player.socketId).emit('playersReady', {
                    playersCount: 2,
                    yourSide: player.side,
                    opponent: { name: opponent.name, avatar: opponent.avatar },
                    message: 'Players ready',
                });
            });
        } else {
            socket.emit('playerWaiting', {
                playersCount: 1,
                message: 'Waiting for the second player...',
            });
        }
    });

    socket.on('makeMove', (data) => {
        const { roomId, move } = data;
        const room = rooms[roomId];
        if (room) {
            room.moves = room.moves || [];
            room.moves.push(move);
        }
        socket.to(roomId).emit('moveMade', move);
    });

    socket.on('playerTimedOut', ({ roomId, loser }) => {
        const room = rooms[roomId];
        if (!room) return;

        const winnerSide = loser === 'white' ? 'black' : 'white';
        const winner = room.players.find(
            (p) => p.side === winnerSide && !p.disconnected,
        );
        const loserPlayer = room.players.find((p) => p.side === loser);

        if (winner) {
            io.to(winner.socketId).emit('playerTimedOut', {
                winner: winner.side,
                message: 'The opponent lost on time, you win.',
            });
        }
        if (loserPlayer) {
            io.to(loserPlayer.socketId).emit('playerTimedOut', {
                winner: winnerSide,
                message: 'You lost on time',
            });
        }

        if (room.timeout) {
            clearTimeout(room.timeout);
        }
        delete rooms[roomId];
    });

    socket.on('leaveGame', ({ roomId }) => {
        if (!rooms[roomId]) return;

        rooms[roomId].players = rooms[roomId].players.filter(p => p.socketId !== socket.id);

        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
            return;
        }

        const remaining = rooms[roomId].players[0];
        io.to(remaining.socketId).emit('opponentLeft', {
            winner: remaining.side,
            message: 'The opponent has left the game; you win.'
        });
        io.to(roomId).emit('playerDisconnected', {
            playersCount: rooms[roomId].players.length,
            message: 'The opponent left the room.'
        });

        delete rooms[roomId];
    });

    socket.on('restartGame', ({ roomId }) => {
        if (!rooms[roomId]) return;

        rooms[roomId].players = rooms[roomId].players.filter(p => p.socketId !== socket.id);

        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
            return;
        }

        const remaining = rooms[roomId].players[0];
        io.to(remaining.socketId).emit('opponentLeft', {
            winner: remaining.side,
            message: 'The opponent has restarted the game, you are winning.'
        });
        io.to(roomId).emit('playerDisconnected', {
            playersCount: rooms[roomId].players.length,
            message: 'The opponent left the room'
        });

        delete rooms[roomId];
    });

    socket.on('disconnect', () => {
        Object.keys(rooms).forEach(roomId => {
            const player = rooms[roomId].players.find(p => p.socketId === socket.id);
            if (player) {
                player.disconnected = true;
                player.disconnectTime = Date.now();

                const remaining = rooms[roomId].players.find(p => !p.disconnected);
                if (remaining) {
                    io.to(remaining.socketId).emit('opponentDisconnected', {
                        message: 'Opponent disconnected. Waiting to reconnect...'
                    });
                }

                rooms[roomId].timeout = setTimeout(() => {
                    const winner = rooms[roomId]?.players.find(p => !p.disconnected);
                    if (winner) {
                        io.to(winner.socketId).emit('opponentLeft', {
                            winner: winner.side,
                            message: 'The opponent has not recovered; you are winning',
                        });
                    }
                    delete rooms[roomId];
                }, 30 * 1000);
            }
        });
    });
});

const port = 3000;

server.listen(port, () => {
    console.log('Server started at port ', port);
});