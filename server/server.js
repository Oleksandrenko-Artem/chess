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
            "https://ab8e79e062a67de2-95-47-113-222.serveousercontent.com",
            "https://740a867ab4462269-95-47-113-222.serveousercontent.com",
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
const FOUR_PLAYER_SIDES = ['yellow', 'blue', 'green', 'red'];
const getRoomCapacity = (room) => room.gameMode === 'four_player' ? 4 : 2;

const normalizeInitialState = (gameMode, initialState) => {
    if (!initialState) return null;

    if (gameMode === 'four_player') {
        return {
            ...initialState,
            gameMode,
            boardSize: 14,
        };
    }

    if (gameMode === 'custom') {
        return {
            ...initialState,
            gameMode,
            boardSize: initialState.boardSize || 8,
        };
    }

    return {
        ...initialState,
        gameMode,
        boardSize: 8,
    };
};

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

    if (room.gameMode === "custom" || room.gameMode === "four_player") {
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
                maxPlayers: getRoomCapacity(room),
                hasPassword: !!room.password,
                hasDisconnected,
            };
        }).filter(room => room.playersCount < room.maxPlayers && !rooms[room.roomId].started && !room.hasDisconnected &&
            !rooms[room.roomId].isQuickGame);

        socket.emit('activeRooms', activeRooms);
    });

    socket.on("findQuickGame", (gameData, callback) => {
        const roomId = Object.keys(rooms).find((id) => {
            const room = rooms[id];
            if (room.started) return false;

            const activePlayers = room.players.filter(p => !p.disconnected).length;

            if (activePlayers >= getRoomCapacity(room)) return false;
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
            return !hasDisconnected && !room.started && activePlayers < getRoomCapacity(room) &&
                room.roomName && room.roomName.trim() === trimmedRoomName;
        });

        if (!foundRoomId) {
            foundRoomId = Object.keys(rooms).find((roomId) => {
                const room = rooms[roomId];
                const activePlayers = room.players.filter(p => !p.disconnected).length;
                const hasDisconnected = room.players.some(p => p.disconnected);
                return !hasDisconnected && !room.started && activePlayers < getRoomCapacity(room) && roomId === trimmedRoomName;
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
                maxPlayers: getRoomCapacity(room),
                gameMode: room.gameMode,
            });

            socket.emit('syncGameState', {
                initialState: room.initialState || null,
                moves: room.moves || [],
            });

            io.to(roomId).emit("playerReconnected", {
                playersCount: room.players.filter(p => !p.disconnected).length,
                maxPlayers: getRoomCapacity(room),
                message: 'The player has been reinstated',
            });

            const activePlayers = room.players.filter(p => !p.disconnected);
            if (activePlayers.length === getRoomCapacity(room)) {
                activePlayers.forEach((player) => {
                    const opponent = activePlayers.find(p => p.socketId !== player.socketId);
                    io.to(player.socketId).emit('playersReady', {
                        playersCount: activePlayers.length,
                        yourSide: player.side,
                        opponent: opponent ? { name: opponent.name, avatar: opponent.avatar, rating: opponent.rating, selectedAchievement: opponent.selectedAchievement, achievementLevel: opponent.achievementLevel } : null,
                        players: activePlayers.map(({ side, name, avatar, rating, selectedAchievement, achievementLevel }) => ({ side, name, avatar, rating, selectedAchievement, achievementLevel })),
                        message: 'Players ready',
                    });
                });
            }
        }
    });
    socket.on('joinGame', (roomId, gameData = {}, callback) => {
        if (!rooms[roomId]) {
            const initialState = normalizeInitialState(
                gameData.gameMode,
                gameData.initialState
            );
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
                    success: false, error: 'Incorrect room password'
                });
            }
            return;
        }

        const activePlayerCount = room.players.filter(p => !p.disconnected).length;
        const hasDisconnected = room.players.some(p => p.disconnected);
        const roomCapacity = getRoomCapacity(room);
        if (hasDisconnected || room.started || activePlayerCount >= roomCapacity) {
            if (callback) {
                callback({
                    success: false, error: 'The room is temporarily unavailable or already full'
                });
            }
            return;
        }

        socket.join(roomId);

        if (!rooms[roomId].initialState && gameData.initialState) {
            rooms[roomId].initialState = normalizeInitialState(
                rooms[roomId].gameMode,
                gameData.initialState
            );
        }

        const side = room.gameMode === 'four_player'
            ? FOUR_PLAYER_SIDES.find(candidate =>
                !rooms[roomId].players.some(player => player.side === candidate)
            )
            : rooms[roomId].players.length === 0 ? 'white' : 'black';
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
            maxPlayers: roomCapacity,
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
        if (activePlayers.length === roomCapacity) rooms[roomId].started = true;
        if (activePlayers.length === roomCapacity) {
            io.to(roomId).emit('gameInfo', {
                roomId,
                playersCount: roomCapacity,
                maxPlayers: roomCapacity,
                side: 'both',
                message: 'Both players have joined!',
                gameMode: rooms[roomId].gameMode,
                roomName: rooms[roomId].roomName,
            });

            activePlayers.forEach((player) => {
                const opponent = activePlayers.find(p => p.socketId !== player.socketId);
                io.to(player.socketId).emit('playersReady', {
                    playersCount: roomCapacity,
                    yourSide: player.side,
                    opponent: opponent ? { name: opponent.name, avatar: opponent.avatar, rating: opponent.rating, selectedAchievement: opponent.selectedAchievement, achievementLevel: opponent.achievementLevel } : null,
                    players: activePlayers.map(({ side, name, avatar, rating, selectedAchievement, achievementLevel }) => ({ side, name, avatar, rating, selectedAchievement, achievementLevel })),
                    message: 'Players ready',
                });
            });
        } else {
            socket.emit('playerWaiting', {
                playersCount: activePlayers.length,
                maxPlayers: roomCapacity,
                message: `Waiting for ${roomCapacity - activePlayers.length} more player(s)...`,
            });
        }
    });

    socket.on("makeMove", async ({ roomId, move }) => {
        console.log("MOVE RECEIVED");
        const room = rooms[roomId];
        if (!room) return;

        room.moves.push(move);

        socket.to(roomId).emit("moveMade", move);

        const winnerSide = move.gameStatus?.match(/^(White|Blue|Black|Red|Yellow|Green) wins$/)?.[1]?.toLowerCase();
        if (winnerSide) {
            await finishGame(roomId, winnerSide);
            const winner = room.players.find(p => p.side === winnerSide);
            if (winner?.userId && move.lastMovePiece) {
                await updateAchievements(winner.userId, move.lastMovePiece);
            }
        }

        if (move.gameStatus === "Draw") {
            await finishGame(roomId, "draw");
        }
    });

    socket.on('playerTimedOut', async ({ roomId, loser }) => {
        const room = rooms[roomId];
        if (!room) return;

        if (room.gameMode === 'four_player') {
            io.to(roomId).emit('playerTimedOut', { loser });
            return;
        }

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
        if (room.gameMode === 'four_player' && leaver) {
            io.to(roomId).emit('playerTimedOut', {
                loser: leaver.side,
                reason: 'left',
            });
            room.players = room.players.filter(
                (p) => p.socketId !== socket.id
            );
            if (room.players.length === 0) {
                if (room.timeout) {
                    clearTimeout(room.timeout);
                }
                delete rooms[roomId];
                return;
            }
            return;
        }
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

                if (rooms[roomId].gameMode === 'four_player') {
                    io.to(roomId).emit('opponentDisconnected', {
                        message: 'A player disconnected. Waiting to reconnect...',
                        playersCount: rooms[roomId].players.filter(p => !p.disconnected).length,
                    });
                }

                const remaining = rooms[roomId].players.find(p => !p.disconnected);
                if (remaining) {
                    io.to(remaining.socketId).emit('opponentDisconnected', {
                        message: 'Opponent disconnected. Waiting to reconnect...'
                    });
                }
                rooms[roomId].timeout = setTimeout(async () => {
                    if (rooms[roomId]?.gameMode === 'four_player') {
                        io.to(roomId).emit('playerTimedOut', {
                            loser: player.side,
                            reason: 'disconnected',
                        });
                        rooms[roomId].players = rooms[roomId].players.filter(
                            p => p.socketId !== socket.id
                        );
                        if (rooms[roomId].players.length === 0) {
                            delete rooms[roomId];
                        }
                        return;
                    }
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