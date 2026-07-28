const express = require("express");
const router = express.Router();

const { updateAchievements } = require("../helpers/achievements");

router.post("/", async (req, res) => {
    const { userId, matePiece } = req.body;

    if (!userId || !matePiece) {
        return res.status(400).json({ message: "Bad request" });
    }

    await updateAchievements(userId, matePiece);

    res.json({ success: true });
});

module.exports = router;