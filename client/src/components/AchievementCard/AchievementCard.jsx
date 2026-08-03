import { useTranslation } from "react-i18next";
import styles from "./AchievementCard.module.scss";

const LEVELS = ["white", "bronze", "silver", "gold", "platinum"];

const AchievementCard = ({
  piece,
  level = 0,
  count = 0,
  onSelect,
  isUnlocked = false,
  isAllUnlocked = false,
}) => {
  const { t } = useTranslation();
  const normalizedLevel = Math.min(level, LEVELS.length - 1);

  const renderStatus = () => {
    if (level === 0) {
      return `${t("achievements_panel.not_unlocked")}`;
    }

    if (isAllUnlocked) {
      return `${t("achievements_panel.all_unlocked")}`;
    }

    if (isUnlocked) {
      return `${t("achievements_panel.unlocked")}`;
    }

    return <button onClick={onSelect}>{t("achievements_panel.claim")}</button>;
  };

  return (
    <div className={styles.card}>
      <div className={styles["image-style"]}>
        <img
          src={`/src/assets/icons/${LEVELS[normalizedLevel]}_${piece}.png`}
          alt={piece}
        />
        <h3>{t(`achievements_panel.${piece}`)}</h3>
      </div>
      <p>{count} {t("achievements_panel.checkmates")}</p>
      <div className={styles["level-div"]}>{renderStatus()}</div>
    </div>
  );
};

export default AchievementCard;
