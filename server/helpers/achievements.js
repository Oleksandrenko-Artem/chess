const User = require("../models/User");

const ACHIEVEMENTS = {
    bishop: [5, 50, 500, 1000],
    rook: [5, 50, 500, 1000],
    horse: [5, 50, 500, 1000],
    ferz: [5, 50, 500, 1000],
    soldier: [5, 50, 500, 1000],
    king: [5, 50, 500, 1000],
    elephant: [5, 50, 500, 1000],
    firzan: [5, 50, 500, 1000],
    knight: [5, 50, 500, 1000],
    prince: [5, 50, 500, 1000],
    duke: [5, 50, 500, 1000],
};

function getLevel(count, levels) {
    if (count >= levels[3]) return 4;
    if (count >= levels[2]) return 3;
    if (count >= levels[1]) return 2;
    if (count >= levels[0]) return 1;
    return 0;
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
    knight: "knight",

    ferz: "ferz",
    firzan: "firzan",

    bishop: "bishop",
    elephant: "elephant",

    king: "king",
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

    user.achievements.icons[matePiece] = getLevel(
        user.achievements.stats[matePiece],
        ACHIEVEMENTS[matePiece]
    );

    await unlockPieceSets(user);
    await user.save();
}

module.exports = {
    updateAchievements,
};