import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getPieceStyle } from "../helpers/getPieceImage";
import { getLastMove } from "../helpers/getLastMove";
import {
  getFourPlayerRealSquare,
  isFourPlayerGame,
} from "../helpers/fourPlayer";
import styles from "./AnalysisPage.module.scss";

const ENGINE_VARIANTS = new Set([
  "chess",
  "chess960",
  "shatranj",
  "shatranj960",
  "new_chess",
  "new_chess960",
  "shatranj_modern",
]);

const getMoveColor = (move, lastMove, previousPosition) => {
  if (move?.color) return move.color;

  const piece = previousPosition?.[lastMove?.fromRank]?.[lastMove?.fromFile];
  return piece?.split("_")[0] || null;
};

const getMoveAnnotation = (moveAnalysis) => {
  const {
    moveLoss,
    evaluationChange,
    uniqueBest,
    isSacrifice,
    missedChance,
  } = moveAnalysis || {};
  if (!Number.isFinite(moveLoss)) return null;
  if (missedChance) return { symbol: "x", quality: "missedChance" };
  if (moveLoss > 300) return { symbol: "??", quality: "blunder" };
  if (moveLoss > 200) return { symbol: "?", quality: "mistake" };
  if (moveLoss > 100) return { symbol: "?!", quality: "inaccuracy" };
  if (uniqueBest && isSacrifice) return { symbol: "!!", quality: "excellent" };
  if (uniqueBest) return { symbol: "!", quality: "good" };
  if (moveLoss <= 200 && evaluationChange > 0) {
    return { symbol: "+", quality: "right" };
  }
  return { symbol: "=", quality: "normal" };
};

const formatMoveLoss = (moveLoss) =>
  Number.isFinite(moveLoss) ? `${(moveLoss / 100).toFixed(2)}` : "—";

const formatSquare = (rank, file, boardSize) =>
  `${String.fromCharCode(97 + file)}${boardSize - rank}`;

const AnalysisPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector((store) => store.users.user);
  const positions = state?.positions;
  const moves = state?.moves;
  const lastMoves = state?.lastMoves;
  const castleDirections = state?.castleDirections;
  const playerColor = state?.playerColor || "white";
  const gameVariant = state?.gameVariant || "chess";
  const [selectedPly, setSelectedPly] = useState(0);
  const [analysis, setAnalysis] = useState([]);
  const [engineDepth, setEngineDepth] = useState(2);
  const [engineStatus, setEngineStatus] = useState("waiting");
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [engineError, setEngineError] = useState("");

  const hasGame =
    Array.isArray(positions) &&
    Array.isArray(moves) &&
    positions.length > 1 &&
    moves.length > 0;
  const analysisByPly = useMemo(
    () => new Map(analysis.map((result) => [result.index, result])),
    [analysis],
  );
  const board = hasGame ? positions[selectedPly] : null;
  const currentMove = selectedPly > 0 ? moves?.[selectedPly - 1] : null;
  const currentLastMove =
    selectedPly > 0
      ? lastMoves?.[selectedPly] ||
        getLastMove(
          positions[selectedPly - 1],
          positions[selectedPly],
          currentMove?.color,
        )
      : null;
  const currentMoveAnalysis =
    selectedPly > 0 ? analysisByPly.get(selectedPly - 1) : null;
  const currentMoveLoss = currentMoveAnalysis?.moveLoss;
  const currentAnnotation = getMoveAnnotation(currentMoveAnalysis);
  const recommendedMove =
    currentMoveLoss > 100 ? currentMoveAnalysis?.bestMove : null;

  useEffect(() => {
    if (!hasGame) return undefined;
    if (!ENGINE_VARIANTS.has(gameVariant)) {
      setEngineStatus("unsupported");
      return undefined;
    }

    setEngineStatus("analyzing");
    setEngineError("");
    setAnalysis([]);
    setProgress({ completed: 0, total: moves.length });

    const worker = new Worker(
      new URL("../components/Pieces/chessWorker.js", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = ({ data }) => {
      if (data.type === "analysis-progress") {
        setProgress({
          completed: data.completed,
          total: data.total,
        });
        if (data.result) {
          setAnalysis((current) => [
            ...current.filter((result) => result.index !== data.result.index),
            data.result,
          ]);
        }
        return;
      }

      if (data.type === "analysis-result") {
        setAnalysis(data.results);
        setEngineStatus("complete");
      }
    };

    worker.onerror = (event) => {
      setEngineError(event.message || "Unknown worker error");
      setEngineStatus("error");
      worker.terminate();
    };

    worker.postMessage({
      type: "analyze-game",
      positions,
      moves,
      lastMoves,
      castleDirections,
      castleDirection: state?.castleDirection,
      gameVariant,
      depth: engineDepth,
    });

    return () => worker.terminate();
  }, [
    hasGame,
    positions,
    moves,
    lastMoves,
    castleDirections,
    state?.castleDirection,
    gameVariant,
    engineDepth,
  ]);

  const changePly = (nextPly) => {
    setSelectedPly(Math.max(0, Math.min(moves.length, nextPly)));
  };

  const moveRows = hasGame
    ? moves.map((move, index) => {
        const ply = index + 1;
      const lastMove =
        lastMoves?.[ply] ||
        getLastMove(positions[index], positions[index + 1], move?.color);
        const color = getMoveColor(
          move,
        lastMove,
          positions[index],
        );
        const moveAnalysis = analysisByPly.get(index);
        const moveLoss = moveAnalysis?.moveLoss;
        return {
          index,
          ply,
          moveNumber: Math.floor(index / 2) + 1,
          color,
          notation:
            typeof move === "string" ? move : move?.text || "—",
          moveLoss,
          annotation: getMoveAnnotation(moveAnalysis),
        };
      })
    : [];
  const rankedMoves = moveRows.filter((move) =>
    Number.isFinite(move.moveLoss),
  );
  const playerMoves = rankedMoves.filter((move) => move.color === playerColor);
  const bestMove = playerMoves.reduce(
    (best, move) => (!best || move.moveLoss < best.moveLoss ? move : best),
    null,
  );
  const worstMove = playerMoves.reduce(
    (worst, move) => (!worst || move.moveLoss > worst.moveLoss ? move : worst),
    null,
  );

  const renderBoard = () => {
    if (!board) return null;

    const boardSize = board.length;
    const flipped = playerColor === "black";
    const fourPlayer = isFourPlayerGame(gameVariant);
    const getArrowPoint = (rank, file) => {
      const displayRank = flipped ? boardSize - 1 - rank : rank;
      const displayFile = flipped ? boardSize - 1 - file : file;
      return {
        x: ((displayFile + 0.5) / boardSize) * 100,
        y: ((displayRank + 0.5) / boardSize) * 100,
      };
    };
    const arrowStart = recommendedMove
      ? getArrowPoint(recommendedMove.fromRank, recommendedMove.fromFile)
      : null;
    const arrowEnd = recommendedMove
      ? getArrowPoint(recommendedMove.toRank, recommendedMove.toFile)
      : null;

    return (
      <div
        className={styles.board}
        style={{ "--analysis-board-size": boardSize }}
        aria-label={t("analysis.board")}
      >
        {Array.from({ length: boardSize }, (_, displayRank) =>
          Array.from({ length: boardSize }, (_, displayFile) => {
            const [rank, file] = fourPlayer
              ? getFourPlayerRealSquare(
                  displayRank,
                  displayFile,
                  playerColor,
                  boardSize,
                )
              : flipped
                ? [boardSize - 1 - displayRank, boardSize - 1 - displayFile]
                : [displayRank, displayFile];
            const piece = board[rank]?.[file];
            const isCurrentFrom =
              currentLastMove?.fromRank === rank &&
              currentLastMove?.fromFile === file;
            const isCurrentTo =
              currentLastMove?.toRank === rank &&
              currentLastMove?.toFile === file;
            const pieceColor = piece?.split("_")[0];

            return (
              <div
                className={`${styles.square} ${
                  (rank + file) % 2 === 0
                    ? styles.lightSquare
                    : styles.darkSquare
                } ${isCurrentFrom || isCurrentTo ? styles.lastMoveSquare : ""}`}
                key={`${rank}-${file}`}
              >
                {displayFile === 0 && (
                  <span className={styles.rankCoordinate}>
                    {boardSize - rank}
                  </span>
                )}
                {displayRank === boardSize - 1 && (
                  <span className={styles.fileCoordinate}>
                    {String.fromCharCode(97 + file)}
                  </span>
                )}
                {piece && (
                  <img
                    className={`${styles.piece} ${
                      piece.endsWith("pawn") || piece.endsWith("soldier")
                        ? styles.pawn
                        : ""
                    }`}
                    src={getPieceStyle(piece, pieceColor === playerColor, user)}
                    alt={piece.replace("_", " ")}
                    draggable="false"
                  />
                )}
                {isCurrentTo && currentAnnotation && (
                  <span
                    className={`${styles.annotationBadge} ${
                      styles[currentAnnotation.quality]
                    }`}
                    aria-label={t(`analysis.${currentAnnotation.quality}`)}
                    title={t(`analysis.${currentAnnotation.quality}`)}
                  >
                    {currentAnnotation.symbol}
                  </span>
                )}
              </div>
            );
          }),
        )}
        {recommendedMove && !fourPlayer && (
          <svg
            className={styles.bestMoveArrow}
            viewBox="0 0 100 100"
            role="img"
            aria-label={`${t("analysis.best_alternative")}: ${formatSquare(
              recommendedMove.fromRank,
              recommendedMove.fromFile,
              boardSize,
            )}-${formatSquare(
              recommendedMove.toRank,
              recommendedMove.toFile,
              boardSize,
            )}`}
          >
            <defs>
              <marker
                id="best-move-arrow-head"
                markerWidth="4"
                markerHeight="3"
                refX="2"
                refY="1.5"
                orient="auto"
              >
                <polygon points="0 0, 4 1.5, 0 3" fill="#39d878" />
              </marker>
            </defs>
            <line
              x1={arrowStart.x}
              y1={arrowStart.y}
              x2={arrowEnd.x}
              y2={arrowEnd.y}
              strokeWidth="8"
              markerEnd="url(#best-move-arrow-head)"
            />
          </svg>
        )}
      </div>
    );
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t("analysis.eyebrow")}</p>
          <h1>{t("analysis.title")}</h1>
          <p>{t("analysis.description")}</p>
        </div>
        <button type="button" onClick={() => navigate(-1)}>
          {t("analysis.back")}
        </button>
      </header>

      {!hasGame ? (
        <p className={styles.empty}>{t("analysis.no_game")}</p>
      ) : (
        <>
          <section className={styles.summary}>
            {[
              { move: bestMove, label: "analysis.best_move", style: styles.best },
              { move: worstMove, label: "analysis.worst_move", style: styles.worst },
            ].map(({ move, label, style }) =>
              move ? (
                <button
                  type="button"
                  className={`${styles.summaryCard} ${style}`}
                  key={label}
                  onClick={() => changePly(move.ply)}
                >
                  <span>{t(label)}</span>
                  <strong>
                    {move.moveNumber}.{move.color === "black" ? ".." : ""}{" "}
                    {move.notation}
                  </strong>
                  <span>
                    {formatMoveLoss(move.moveLoss)} {t("analysis.pawns")}
                  </span>
                </button>
              ) : null,
            )}
          </section>
          <div className={styles.analysisLayout}>
            <section className={styles.boardPanel}>
              {renderBoard()}
              <div className={styles.navigation}>
                <button
                  type="button"
                  onClick={() => changePly(0)}
                  disabled={selectedPly === 0}
                  aria-label={t("analysis.first_move")}
                >
                  |&lt;
                </button>
                <button
                  type="button"
                  onClick={() => changePly(selectedPly - 1)}
                  disabled={selectedPly === 0}
                  aria-label={t("analysis.previous_move")}
                >
                  &lt;
                </button>
                <span>
                  {t("analysis.ply_counter", {
                    current: selectedPly,
                    total: moves.length,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => changePly(selectedPly + 1)}
                  disabled={selectedPly === moves.length}
                  aria-label={t("analysis.next_move")}
                >
                  &gt;
                </button>
                <button
                  type="button"
                  onClick={() => changePly(moves.length)}
                  disabled={selectedPly === moves.length}
                  aria-label={t("analysis.last_move")}
                >
                  &gt;|
                </button>
              </div>
              <input
                className={styles.moveSlider}
                type="range"
                min="0"
                max={moves.length}
                value={selectedPly}
                onChange={(event) => changePly(Number(event.target.value))}
                aria-label={t("analysis.move_slider")}
              />
              <div className={styles.currentMove}>
                {currentMove ? (
                  <>
                    <strong>
                      {typeof currentMove === "string"
                        ? currentMove
                        : currentMove.text}
                    </strong>
                    {currentAnnotation && (
                      <span
                        className={`${styles.annotationBadge} ${
                          styles[currentAnnotation.quality]
                        }`}
                      >
                        {currentAnnotation.symbol}
                      </span>
                    )}
                    <span>
                      {Number.isFinite(currentMoveLoss)
                        ? `${formatMoveLoss(currentMoveLoss)} ${t("analysis.pawns")}`
                        : t("analysis.engine_pending")}
                    </span>
                    {recommendedMove && (
                      <span className={styles.bestAlternative}>
                        {t("analysis.best_alternative")}:{" "}
                        {formatSquare(
                          recommendedMove.fromRank,
                          recommendedMove.fromFile,
                          board.length,
                        )}
                        -
                        {formatSquare(
                          recommendedMove.toRank,
                          recommendedMove.toFile,
                          board.length,
                        )}
                      </span>
                    )}
                  </>
                ) : (
                  <span>{t("analysis.start_position")}</span>
                )}
              </div>
            </section>

            <aside className={styles.movePanel}>
              <div className={styles.engineStatus} aria-live="polite">
                <label className={styles.depthControl}>
                  {t("analysis.depth")}
                  <select
                    value={engineDepth}
                    onChange={(event) =>
                      setEngineDepth(Number(event.target.value))
                    }
                  >
                    <option value={1}>{t("analysis.depth_shallow")}</option>
                    <option value={2}>{t("analysis.depth_fast")}</option>
                    <option value={3}>{t("analysis.depth_deep")}</option>
                    <option value={4}>{t("analysis.depth_deeper")}</option>
                    <option value={5}>{t("analysis.depth_very_deep")}</option>
                  </select>
                </label>
                {engineStatus === "analyzing" &&
                  t("analysis.engine_progress", {
                    ...progress,
                    depth: engineDepth,
                  })}
                {engineStatus === "complete" &&
                  t("analysis.engine_complete", { depth: engineDepth })}
                {engineStatus === "unsupported" &&
                  t("analysis.engine_unsupported")}
                {engineStatus === "error" &&
                  t("analysis.engine_error", { message: engineError })}
              </div>
              <div className={styles.moveList}>
                {moveRows.map((row) => (
                  <button
                    type="button"
                    className={`${styles.moveRow} ${
                      selectedPly === row.ply ? styles.selectedMove : ""
                    }`}
                    key={row.index}
                    onClick={() => changePly(row.ply)}
                  >
                    <span className={styles.moveNumber}>
                      {row.moveNumber}.{row.color === "black" ? ".." : ""}
                    </span>
                    <span className={styles.moveText}>{row.notation}</span>
                    {row.annotation && (
                      <span
                        className={`${styles.moveAnnotation} ${
                          styles[row.annotation.quality]
                        }`}
                        title={t(`analysis.${row.annotation.quality}`)}
                      >
                        {row.annotation.symbol}
                      </span>
                    )}
                    <span className={styles.moveLoss}>
                      {Number.isFinite(row.moveLoss)
                        ? formatMoveLoss(row.moveLoss)
                        : ""}
                    </span>
                  </button>
                ))}
              </div>
              <p className={styles.note}>{t("analysis.method")}</p>
            </aside>
          </div>
        </>
      )}
    </main>
  );
};

export default AnalysisPage;
