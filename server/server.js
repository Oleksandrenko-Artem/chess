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
            "https://2f7c7e569c0aded6-95-47-113-249.serveousercontent.com",
            "https://0e1255ecc5a24e53-95-47-113-249.serveousercontent.com",
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
    console.log('User connected:', socket.id);

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
                message: 'Игрок восстановлен',
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
                        message: 'Оба игрока готовы! Начинайте игру',
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

        console.log(`User ${socket.id} joined room ${roomId} as ${side}. Game mode: ${rooms[roomId].gameMode}`);
        console.log(`Total players in room ${roomId}: ${rooms[roomId].players.length}`);
        console.log(`Players list:`, rooms[roomId].players);

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
            console.log(`✅ Sending playersReady to room ${roomId}`);
            console.log(`   Socket IDs in room: ${rooms[roomId].players.map(p => p.socketId).join(', ')}`);

            io.to(roomId).emit('gameInfo', {
                roomId,
                playersCount: 2,
                side: 'both',
                message: 'Оба игрока присоединились!',
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
                    message: 'Оба игрока готовы! Начинайте игру',
                });
                console.log(`   Sent playersReady to player ${index + 1} (${player.side}): ${player.socketId}`);
            });
        } else {
            console.log(`First player waiting in room ${roomId}`);
            socket.emit('playerWaiting', {
                playersCount: 1,
                message: 'Ожидание второго игрока...',
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
                message: 'Противник проиграл по времени, вы побеждаете',
            });
        }
        if (loserPlayer) {
            io.to(loserPlayer.socketId).emit('playerTimedOut', {
                winner: winnerSide,
                message: 'Вы проиграли по времени',
            });
        }

        if (room.timeout) {
            clearTimeout(room.timeout);
        }
        delete rooms[roomId];
    });

    socket.on('leaveGame', ({ roomId }) => {
        console.log(`User ${socket.id} leaves room ${roomId}`);
        if (!rooms[roomId]) return;

        rooms[roomId].players = rooms[roomId].players.filter(p => p.socketId !== socket.id);

        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
            return;
        }

        const remaining = rooms[roomId].players[0];
        io.to(remaining.socketId).emit('opponentLeft', {
            winner: remaining.side,
            message: 'Противник покинул игру, вы побеждаете'
        });
        io.to(roomId).emit('playerDisconnected', {
            playersCount: rooms[roomId].players.length,
            message: 'Противник вышел из комнаты'
        });

        delete rooms[roomId];
    });

    socket.on('restartGame', ({ roomId }) => {
        console.log(`User ${socket.id} restarts game in room ${roomId}`);
        if (!rooms[roomId]) return;

        rooms[roomId].players = rooms[roomId].players.filter(p => p.socketId !== socket.id);

        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
            return;
        }

        const remaining = rooms[roomId].players[0];
        io.to(remaining.socketId).emit('opponentLeft', {
            winner: remaining.side,
            message: 'Противник начал игру заново, вы побеждаете'
        });
        io.to(roomId).emit('playerDisconnected', {
            playersCount: rooms[roomId].players.length,
            message: 'Противник вышел из комнаты'
        });

        delete rooms[roomId];
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        Object.keys(rooms).forEach(roomId => {
            const player = rooms[roomId].players.find(p => p.socketId === socket.id);
            if (player) {
                player.disconnected = true;
                player.disconnectTime = Date.now();

                const remaining = rooms[roomId].players.find(p => !p.disconnected);
                if (remaining) {
                    io.to(remaining.socketId).emit('opponentDisconnected', {
                        message: 'Противник отключился. Ожидание переподключения...'
                    });
                }

                rooms[roomId].timeout = setTimeout(() => {
                    console.log(`Room ${roomId} deleted due to player disconnection timeout`);
                    const winner = rooms[roomId]?.players.find(p => !p.disconnected);
                    if (winner) {
                        io.to(winner.socketId).emit('opponentLeft', {
                            winner: winner.side,
                            message: 'Противник не восстановился, вы побеждаете',
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