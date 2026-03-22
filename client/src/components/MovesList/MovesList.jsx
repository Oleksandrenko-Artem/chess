import React from "react";
import { useAppContext } from "../../contexts/Context";
import styles from "./MovesList.module.scss";

const MovesList = () => {
  const {
    appState: { movesList },
  } = useAppContext();
  let moveCount = 0;
  let realIndex = 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles["moves-list"]}>
        {movesList.map((move, i) => {
          if (move === null) return null;

          const isWhiteMove = realIndex % 2 === 0;
          if (isWhiteMove) moveCount++;
          realIndex++;

          return (
            <div key={i} data-number={isWhiteMove ? moveCount : undefined}>
              {move}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default MovesList;
