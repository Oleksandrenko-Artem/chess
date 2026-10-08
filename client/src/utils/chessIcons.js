const modules = import.meta.glob('../assets/icons/pieces/*.png', { eager: true, query: '?url' });

export const PIECES = [
    'imperator', 'king', 'ferz', 'rook', 'horse', 'bishop', 'soldier', 'pawn', 'alfil',
    'firzan', 'dinozavr', 'tank', 'camel', 'giraffe', 'sailboat', 'rukh', 'checkers',
    'chariot', 'wazir', 'zebra', 'lion', 'archbishop', 'marshal', 'amazon',
    'knight', 'elephant', 'rhino', 'wildebeest', 'man', 'duke', 'prince',
    'alibaba', 'crown'
];

export const imageMap = PIECES.reduce((acc, piece) => {
    let fileName = piece;
    if (piece === 'pawn') fileName = 'soldier';
    if (piece === 'imperator') fileName = 'king';

    const blackPath = modules[`../assets/icons/pieces/black_${fileName}.png`]?.default;
    const whitePath = modules[`../assets/icons/pieces/white_${fileName}.png`]?.default;
    const redPath = modules[`../assets/icons/pieces/red_${fileName}.png`]?.default;
    const yellowPath = modules[`../assets/icons/pieces/yellow_${fileName}.png`]?.default;
    const greenPath = modules[`../assets/icons/pieces/green_${fileName}.png`]?.default;
    const bluePath = modules[`../assets/icons/pieces/blue_${fileName}.png`]?.default;

    if (blackPath) acc[`black_${piece}`] = blackPath;
    if (whitePath) acc[`white_${piece}`] = whitePath;
    if (redPath) acc[`red_${piece}`] = redPath;
    if (yellowPath) acc[`yellow_${piece}`] = yellowPath;
    if (greenPath) acc[`green_${piece}`] = greenPath;
    if (bluePath) acc[`blue_${piece}`] = bluePath;

    return acc;
}, {
    brick: modules['../assets/icons/pieces/brick.png']?.default,
});
