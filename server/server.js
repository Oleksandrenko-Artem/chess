const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://381004cf1c1718b4-95-47-113-161.serveousercontent.com",
            "https://a5638d5bd550592b-95-47-113-161.serveousercontent.com",
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
        const activeRooms = Object.keys(rooms).map(roomId => ({
            roomId,
            roomName: rooms[roomId].roomName,
            playersCount: rooms[roomId].players.length,
            createdAt: rooms[roomId].createdAt || Date.now(),
            gameMode: rooms[roomId].gameMode,
        })).filter(room => room.playersCount === 1);

        socket.emit('activeRooms', activeRooms);
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

            if (room.players.length === 2 && room.players.every(p => !p.disconnected)) {
                room.players.forEach((player, index) => {
                    io.to(player.socketId).emit('playersReady', {
                        playersCount: 2,
                        yourSide: player.side,
                        message: 'Оба игрока готовы! Начинайте игру',
                    });
                });
            }
        }
    });
    socket.on('joinGame', (roomId, gameData = {}) => {
        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: [],
                createdAt: Date.now(),
                gameMode: gameData.gameMode,
                initialState: gameData.initialState || null,
                moves: [],
                roomName: gameData.roomName && gameData.roomName.trim()
                    ? gameData.roomName
                    : null,
            };
        }

        if (!rooms[roomId].initialState && gameData.initialState) {
            rooms[roomId].initialState = gameData.initialState;
        }

        const side = rooms[roomId].players.length === 0 ? 'white' : 'black';
        rooms[roomId].players.push({ socketId: socket.id, side, disconnected: false });

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

        if (rooms[roomId].initialState || (rooms[roomId].moves && rooms[roomId].moves.length > 0)) {
            socket.emit('syncGameState', {
                initialState: rooms[roomId].initialState,
                moves: rooms[roomId].moves,
            });
        }

        if (rooms[roomId].players.length === 2) {
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

            rooms[roomId].players.forEach((player, index) => {
                io.to(player.socketId).emit('playersReady', {
                    playersCount: 2,
                    yourSide: player.side,
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

                rooms[roomId].timeout = setTimeout(() => {
                    console.log(`Room ${roomId} deleted due to player disconnection timeout`);
                    delete rooms[roomId];
                }, 5 * 60 * 1000);

                const remaining = rooms[roomId].players.find(p => !p.disconnected);
                if (remaining) {
                    io.to(remaining.socketId).emit('opponentDisconnected', {
                        message: 'Противник отключился. Ожидание переподключения...'
                    });
                }
            }
        });
    });
});

const port = 3000;

server.listen(port, () => {
    console.log('Server started at port ', port);
});