import styles from "./AchievementCard.module.scss";
const LEVELS = ["white", "bronze", "silver", "gold", "platinum"];

const AchievementCard = ({ piece, level = 0, count = 0, onSelect }) => {
  return (
    <div className={styles.card}>
      <div className={styles["image-style"]}>
        <img
          src={`/src/assets/icons/${LEVELS[level]}_${piece}.png`}
          alt={piece}
        />
        <h3>{piece}</h3>
      </div>
      <p>{count} матов</p>
      <div className={styles['level-div']}>
        {level === 0 && "Не открыто"}
        {level === 1 && "Бронза"}
        {level === 2 && "Серебро"}
        {level === 3 && "Золото"}
        {level === 4 && "Платина"}
        {level > 0 && <button onClick={onSelect}>Выбрать</button>}
      </div>
    </div>
  );
};

export default AchievementCard;