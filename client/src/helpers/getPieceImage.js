import {
    hasFourPlayerNativeIcon,
    normalizeFourPlayerPiece,
} from "./fourPlayer";

const GRAY_ICON_TYPES = {
    pawn: "gray_pawn.png",
    soldier: "gray_pawn.png",
    rook: "gray_rook.png",
    horse: "gray_horse.png",
    knight: "gray_horse.png",
    bishop: "gray_bishop.png",
    ferz: "gray_ferz.png",
    king: "gray_kingpng.png",
    imperator: "gray_kingpng.png",
};

export const hasGrayPieceIcon = (piece) =>
    Boolean(GRAY_ICON_TYPES[piece?.split("_").at(-1)]);

export const getPieceStyle = (piece, isOwnPiece, user, isEliminated = false) => {
    const gameVariant = localStorage.getItem("chess_variant");

    if (gameVariant === "four_player") {
        piece = normalizeFourPlayerPiece(piece);
    }

    if (isEliminated) {
        const grayIcon = GRAY_ICON_TYPES[piece.split("_").at(-1)];
        if (grayIcon) return `/src/assets/icons/${grayIcon}`;
    }

    if (gameVariant === "custom") {
        return `/src/assets/icons/${piece}.png`;
    }

    if (gameVariant === "four_player") {
        if (hasFourPlayerNativeIcon(piece)) {
            return `/src/assets/icons/${piece}.png`;
        }
        piece = piece.replace(/^(yellow|blue)_/, "white_").replace(/^(green|red)_/, "black_");
    }

    let style = "standart";

    if (isOwnPiece) {
        style =
            user?.achievements?.selectedPieceSet ||
            localStorage.getItem("pieceStyle") ||
            "standart";
    }

    if (style === "iridium" && user?.role !== "admin") {
        style = "standart";
    }

    if (style === "standart") {
        return `/src/assets/icons/${piece}.png`;
    }

    const pieceName = piece.replace(/^white_|^black_/, "");

    return `/src/assets/icons/${style}_${pieceName}.png`;
};