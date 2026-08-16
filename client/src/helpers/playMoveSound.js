import moveSound from "../assets/sounds/move.mp3";
import captureSound from "../assets/sounds/capture.mp3";
import checkSound from "../assets/sounds/check.mp3";
import gameEndSound from "../assets/sounds/checkmate.mp3";

const sounds = {
    move: new Audio(moveSound),
    capture: new Audio(captureSound),
    check: new Audio(checkSound),
    gameEnd: new Audio(gameEndSound),
};

const play = (audio) => {
    const soundEnabled = localStorage.getItem("chess_sounds") !== "off";

    if (!soundEnabled) return;

    audio.currentTime = 0;
    audio.play().catch(() => { });
};

export const playMoveSound = ({ captured, isCheck, gameStatus }) => {
    if (gameStatus === "White wins" || gameStatus === "Black wins" || gameStatus === "Draw") {
        play(sounds.gameEnd);
        return;
    }

    if (isCheck) {
        play(sounds.check);
        return;
    }

    if (captured) {
        play(sounds.capture);
        return;
    }

    play(sounds.move);
};

export const setSoundEnabled = (enabled) => {
    localStorage.setItem("chess_sounds", enabled ? "on" : "off");
};

export const isSoundEnabled = () => {
    return localStorage.getItem("chess_sounds") !== "off";
};