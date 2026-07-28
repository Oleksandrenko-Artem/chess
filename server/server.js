const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const { getInitialStateByMode } = require('./helpers');
const { updateAchievements } = require("./helpers/achievements.js");
const User = require('./models/User');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://f5f2dc3e7012cea7-95-47-113-3.serveousercontent.com",
            "https://3245613157cc7d47-95-47-113-3.serveousercontent.com",
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

async function updateRating(whiteId, blackId, result) {
    const white = await User.findById(whiteId);
    const black = await User.findById(blackId);

    const K = 20;

    if (!white || !black) {
        return;
    }
    
    const expectedWhite =
        1 / (1 + Math.pow(10, (black.rating - white.rating) / 400));

    const expectedBlack =
        1 / (1 + Math.pow(10, (white.rating - black.rating) / 400));

    let scoreWhite;
    let scoreBlack;

    if (result === "white") {
        scoreWhite = 1;
        scoreBlack = 0;
    } else if (result === "black") {
        scoreWhite = 0;
        scoreBlack = 1;
    } else {
        scoreWhite = 0.5;
        scoreBlack = 0.5;
    }

    white.rating = Math.round(
        white.rating + K * (scoreWhite - expectedWhite)
    );

    black.rating = Math.round(
        black.rating + K * (scoreBlack - expectedBlack)
    );

    await white.save();
    await black.save();
}

async function finishGame(roomId, result) {
    const room = rooms[roomId];
    if (!room || room.finished) return;

    room.finished = true;

    if (room.gameMode === "custom") {
        return;
    }

    const white = room.players.find(p => p.side === "white");
    const black = room.players.find(p => p.side === "black");

    if (!white || !black) return;

    await updateRating(white.userId, black.userId, result);

    const whiteUser = await User.findById(white.userId);
    const blackUser = await User.findById(black.userId);

    io.to(white.socketId).emit("ratingUpdated", {
        myRating: whiteUser.rating,
        opponentRating: blackUser.rating,
    });

    io.to(black.socketId).emit("ratingUpdated", {
        myRating: blackUser.rating,
        opponentRating: whiteUser.rating,
    });
}

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
        }).filter(room => room.playersCount === 1 && !room.hasDisconnected &&
            !rooms[room.roomId].isQuickGame);

        socket.emit('activeRooms', activeRooms);
    });

    socket.on("findQuickGame", (gameData, callback) => {
        const roomId = Object.keys(rooms).find((id) => {
            const room = rooms[id];

            const activePlayers = room.players.filter(p => !p.disconnected).length;

            if (activePlayers !== 1) return false;
            if (room.password) return false;

            const waitTime = Date.now() - room.createdAt;

            let maxDiff = 100;

            if (waitTime > 10000) maxDiff = 200;
            if (waitTime > 20000) maxDiff = 400;
            if (waitTime > 30000) maxDiff = Infinity;

            const ratingDiff = Math.abs(room.players[0].rating - gameData.userRating);

            return (
                room.gameMode === gameData.gameMode &&
                room.whiteTime === gameData.whiteTime &&
                room.blackTime === gameData.blackTime &&
                ratingDiff <= maxDiff
            );
        });

        if (roomId) {
            callback({
                success: true,
                roomId,
                create: false,
            });
        } else {
            callback({
                success: true,
                create: true,
            });
        }
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
                        opponent: { name: opponent.name, avatar: opponent.avatar, rating: opponent.rating, selectedAchievement: opponent.selectedAchievement, achievementLevel: opponent.achievementLevel },
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
                isQuickGame: gameData.isQuickGame || false,
            };
        }

        const room = rooms[roomId];
        if (room.password && room.password !== (gameData.password && gameData.password.trim())) {
            if (callback) {
                callback({
                    success: false, error: 'Incorrect room password' });
            }
            return;
        }

        const activePlayerCount = room.players.filter(p => !p.disconnected).length;
        const hasDisconnected = room.players.some(p => p.disconnected);
        if (hasDisconnected || activePlayerCount >= 2) {
            if (callback) {
                callback({
                    success: false, error: 'The room is temporarily unavailable or already full' });
            }
            return;
        }

        socket.join(roomId);

        if (!rooms[roomId].initialState && gameData.initialState) {
            rooms[roomId].initialState = gameData.initialState;
        }

        const side = rooms[roomId].players.length === 0 ? 'white' : 'black';
        rooms[roomId].players.push({
            socketId: socket.id,
            userId: gameData.userId,
            side,
            disconnected: false,
            name: gameData.userName,
            avatar: gameData.userAvatar,
            rating: gameData.userRating,
            selectedAchievement: gameData.userSelectedAchievement,
            achievementLevel: gameData.userAchievementLevel,
        });

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
                side,
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
                    opponent: { name: opponent.name, avatar: opponent.avatar, rating: opponent.rating, selectedAchievement: opponent.selectedAchievement, achievementLevel: opponent.achievementLevel },
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

    socket.on("makeMove", async ({ roomId, move }) => {
        console.log("MOVE RECEIVED");
        const room = rooms[roomId];
        if (!room) return;

        room.moves.push(move);

        socket.to(roomId).emit("moveMade", move);

        if (move.gameStatus === "White wins") {
            await finishGame(roomId, "white");

            const winner = room.players.find(p => p.side === "white");

            await updateAchievements(
                winner.userId,
                move.lastMovePiece
            );
        }

        if (move.gameStatus === "Black wins") {
            await finishGame(roomId, "black");

            const winner = room.players.find(p => p.side === "black");

            await updateAchievements(
                winner.userId,
                move.lastMovePiece
            );
        }

        if (move.gameStatus === "Draw") {
            await finishGame(roomId, "draw");
        }
    });

    socket.on('playerTimedOut', async ({ roomId, loser }) => {
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
            await finishGame(roomId, winner.side);
        }
        if (loserPlayer) {
            io.to(loserPlayer.socketId).emit('playerTimedOut', {
                winner: winnerSide,
                message: 'You lost on time',
            });
            await finishGame(roomId, winner.side);
        }

        if (room.timeout) {
            clearTimeout(room.timeout);
        }
        delete rooms[roomId];
    });

    socket.on("leaveGame", async ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;

        const leaver = room.players.find(p => p.socketId === socket.id);
        const winner = room.players.find(p => p.socketId !== socket.id);

        if (winner) {
            io.to(winner.socketId).emit("opponentLeft", {
                winner: winner.side,
                message: "The opponent has left the game; you win."
            });

            await finishGame(roomId, winner.side);
        }

        delete rooms[roomId];
    });

    socket.on('restartGame', async ({ roomId }) => {
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
        await finishGame(roomId, remaining.side);
        io.to(roomId).emit('playerDisconnected', {
            playersCount: rooms[roomId].players.length,
            message: 'The opponent left the room'
        });

        delete rooms[roomId];
    });

    socket.on('disconnect', async () => {
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

                rooms[roomId].timeout = setTimeout(async () => {
                    const winner = rooms[roomId]?.players.find(p => !p.disconnected);
                    if (winner) {
                        io.to(winner.socketId).emit('opponentLeft', {
                            winner: winner.side,
                            message: 'The opponent has not recovered; you are winning',
                        });
                        await finishGame(roomId, winner.side);
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