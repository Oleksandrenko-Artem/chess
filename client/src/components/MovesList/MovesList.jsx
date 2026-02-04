import React from "react";
import { useAppContext } from "../../contexts/Context";
import styles from "./MovesList.module.scss";

const MovesList = () => {
  const {
    appState: { movesList },
  } = useAppContext();
  return (
    <div className={styles.wrapper}>
      <div className={styles["moves-list"]}>
        {movesList.map((move, i) => (
          <div key={i} data-number={Math.floor(i / 2 + 1)}>
            {move}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovesList;
