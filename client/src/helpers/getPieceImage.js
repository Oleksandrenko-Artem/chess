import { IMAGE_SRC } from "../constants";
import {
    hasFourPlayerNativeIcon,
    normalizeFourPlayerPiece,
} from "./fourPlayer";

const GRAY_ICON_TYPES = {
    pawn: "gray_pawn.png",
    soldier: "gray_pawn.png",
    checkers: "gray_checkers.png",
    crown: "gray_crown.png",
    rook: "gray_rook.png",
    chariot: "gray_chariot.png",
    horse: "gray_horse.png",
    elephant: "gray_elephant.png",
    alfil: "gray_alfil.png",
    tank: "gray_tank.png",
    alibaba: "gray_alibaba.png",
    camel: "gray_camel.png",
    lion: "gray_lion.png",
    zebra: "gray_zebra.png",
    wildebeest: "gray_wildebeest.png",
    knight: "gray_knight.png",
    bishop: "gray_bishop.png",
    rhino: "gray_rhino.png",
    giraffe: "gray_giraffe.png",
    rukh: "gray_rukh.png",
    archbishop: "gray_archbishop.png",
    marshal: "gray_marshal.png",
    amazon: "gray_amazon.png",
    firzan: "gray_firzan.png",
    ferz: "gray_ferz.png",
    prince: "gray_prince.png",
    duke: "gray_duke.png",
    wazir: "gray_wazir.png",
    king: "gray_king.png",
    imperator: "gray_king.png",
    man: "gray_man.png",
    dinozavr: "gray_dinozavr.png",
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
        if (grayIcon) return `${IMAGE_SRC.SRC_PIECES}/${grayIcon}`;
    }

    if (gameVariant === "custom") {
        return `${IMAGE_SRC.SRC_PIECES}/${piece}.png`;
    }

    if (gameVariant === "four_player") {
        if (hasFourPlayerNativeIcon(piece)) {
            return `${IMAGE_SRC.SRC_PIECES}/${piece}.png`;
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
        return `${IMAGE_SRC.SRC_PIECES}/${piece}.png`;
    }

    const pieceName = piece.replace(/^white_|^black_/, "");

    return `${IMAGE_SRC.SRC_PIECES}/${style}_${pieceName}.png`;
};