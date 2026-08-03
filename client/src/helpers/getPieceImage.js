export const getPieceStyle = (piece, isOwnPiece, user) => {
    const gameVariant = localStorage.getItem("chess_variant");

    if (gameVariant === "custom") {
        return `/src/assets/icons/${piece}.png`;
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