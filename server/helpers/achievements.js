const User = require("../models/User");

const ACHIEVEMENTS = {
    bishop: [3, 12, 26, 68],
    rook: [5, 50, 100, 250],
    horse: [2, 10, 22, 45],
    ferz: [5, 50, 100, 250],
    soldier: [1, 6, 14, 32],
    king: [1, 5, 10, 50],
    elephant: [3, 12, 26, 68],
    firzan: [3, 12, 26, 68],
    knight: [5, 50, 100, 250],
    prince: [3, 12, 26, 68],
    duke: [3, 12, 26, 68],
};

function getLevel(count, levels) {
    if (count >= levels[3]) return 4;
    if (count >= levels[2]) return 3;
    if (count >= levels[1]) return 2;
    if (count >= levels[0]) return 1;
    return 0;
}

function normalizeAchievementLevels(user) {
    if (!user?.achievements) return user;

    const stats = user.achievements.stats || {};
    const icons = user.achievements.icons || {};

    Object.keys(ACHIEVEMENTS).forEach((piece) => {
        const count = Number(stats[piece] || 0);
        const levels = ACHIEVEMENTS[piece] || [0, 0, 0, 0];
        icons[piece] = getLevel(count, levels);
    });

    user.achievements.icons = icons;
    return user;
}

async function unlockPieceSets(user) {

    const icons = user.achievements.icons;

    const values = Object.values(icons);

    user.achievements.pieceSets.bronze =
        values.every(v => v >= 1);

    user.achievements.pieceSets.silver =
        values.every(v => v >= 2);

    user.achievements.pieceSets.gold =
        values.every(v => v >= 3);

    user.achievements.pieceSets.platinum =
        values.every(v => v >= 4);
}

const PIECE_ALIASES = {
    pawn: "soldier",
    soldier: "soldier",

    rook: "rook",
    chariot: "rook",
    sailboat: "rook",

    horse: "horse",
    faras: "horse",
    knight: "knight",

    ferz: "ferz",
    firzan: "firzan",

    bishop: "bishop",
    elephant: "elephant",

    king: "king",
    king: "imperator",

    prince: "prince",
    duke: "duke",
};

async function updateAchievements(userId, matePiece) {
    matePiece = PIECE_ALIASES[matePiece] || matePiece;

    if (!ACHIEVEMENTS[matePiece]) return;

    const user = await User.findById(userId);
    if (!user) return;

    if (user.achievements.stats[matePiece] == null) {
        user.achievements.stats[matePiece] = 0;
    }

    user.achievements.stats[matePiece]++;

    normalizeAchievementLevels(user);
    await unlockPieceSets(user);
    await user.save();
}

module.exports = {
    updateAchievements,
    normalizeAchievementLevels,
};