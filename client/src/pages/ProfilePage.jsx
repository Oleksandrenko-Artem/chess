import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { deleteUserThunk, findUserAccountThunk } from "../store/usersSlice";
import { findUserById, updateUser } from "../api";
import styles from "./Pages.module.scss";
import { updateUserThunk } from "./../store/usersSlice";
import UpdateForm from "./../components/forms/UpdateForm";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.users);
  const [viewedUser, setViewedUser] = useState(null);
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    if (userId) {
      findUserById(userId)
        .then((response) => setViewedUser(response.data.data))
        .catch(() => setViewedUser(null));
    } else if (!user) {
      dispatch(findUserAccountThunk());
    }
  }, [dispatch, user, userId]);

  const profileUser = userId ? viewedUser : user;
  const isOwnProfile = !userId;

  useEffect(() => {
    setAvatar(profileUser?.avatar || null);
  }, [profileUser]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".ico",
        ".bmp",
      ];
      const fileName = file.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext),
      );
      if (!hasValidExtension && !file.type.startsWith("image/")) {
        alert(
          "Please select an image or icon file (jpg, png, gif, svg, ico, etc.)",
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setAvatar(base64String);
        uploadAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadAvatar = async (base64String) => {
    try {
      setIsUploading(true);
      if (!user?._id) {
        alert("User not loaded. Please refresh the page.");
        return;
      }

      const response = await updateUser(user._id, { avatar: base64String });
      dispatch(findUserAccountThunk());
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert(`Failed to upload avatar: ${err.message}`);
      setAvatar(user.avatar);
    } finally {
      setIsUploading(false);
    }
  };
  const removeAvatar = async () => {
    try {
      setIsUploading(true);
      const response = await updateUser(user._id, { avatar: null });
      setAvatar(null);
      dispatch(findUserAccountThunk());
    } catch (err) {
      console.error("Error removing avatar:", err);
      alert(`Failed to remove avatar: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  const handleUpdateForm = () => {
    setIsUpdate(!isUpdate);
  };
  const handleDeleteUser = async (event) => {
    event.stopPropagation();

    if (window.confirm(`${t("profile.delete_user")}`)) {
      try {
        await dispatch(deleteUserThunk(user._id)).unwrap();
        navigate("/");
      } catch (err) {
        console.error("Delete user error:", err);
        navigate("/");
      }
    }
  };
  const handleNavigateAchievements = () => {
    navigate("/achievements");
  };

  return (
    <div className={styles.profile}>
      <h2>{t("profile.profile")}</h2>
      <div className={styles["profile-wrapper"]}>
        <div>
          {avatar && (
            <div className={styles["avatar-div"]}>
              <img
                src={avatar}
                alt="Profile Avatar"
                className={styles["profile-avatar"]}
              />
              {isOwnProfile && (
                <div className={styles["buttons-div"]}>
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading
                        ? `${t("profile.upload_photo")}`
                        : `${t("profile.change_photo")}`}
                    </button>
                    <button onClick={removeAvatar} disabled={isUploading}>
                      {t("profile.remove_photo")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {!avatar && (
            <div className={styles["avatar-div"]}>
              <img
                src="/src/assets/icons/account.png"
                alt="Default Avatar"
                className={styles["default-avatar"]}
              />
              {isOwnProfile && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={styles["upload-btn"]}
                >
                  {isUploading
                    ? `${t("profile.upload_photo")}`
                    : `${t("profile.change_photo")}`}
                </button>
              )}
            </div>
          )}
          {isOwnProfile && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.ico,.svg"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <div className={styles["account-btns"]}>
                <button onClick={handleUpdateForm}>
                  {t("form_panel.update")}
                </button>
                <button onClick={handleDeleteUser}>
                  {t("form_panel.delete")}
                </button>
              </div>
            </>
          )}
        </div>
        <div className={styles["profile-info"]}>
          <p>
            <b>{t("profile.name")}:</b> {profileUser?.name}{" "}
            {profileUser?.achievements?.selectedIcon && (
              <img
                src={`/src/assets/icons/${(() => {
                  const selected = profileUser.achievements.selectedIcon;
                  if (selected.includes("_")) {
                    const [style] = selected.split("_");
                    return style;
                  }

                  const level = user.achievements.icons[selected] ?? 0;
                  return (
                    ["", "bronze", "silver", "gold", "platinum"][
                      Math.min(level, 4)
                    ] || "bronze"
                  );
                })()}_${(() => {
                  const selected = profileUser.achievements.selectedIcon;
                  if (selected.includes("_")) {
                    return selected.split("_").slice(1).join("_");
                  }
                  return selected;
                })()}.png`}
                width={24}
                height={24}
                alt=""
              />
            )}
          </p>
          <p>
            <b>{t("profile.rating")}:</b> {profileUser?.rating}
          </p>
          <p>
            <b>{t("profile.role")}:</b> {profileUser?.role}
          </p>
          {isOwnProfile && (
            <>
              <p>
                <b>{t("profile.email")}:</b> {profileUser?.email}
              </p>
              <button onClick={handleNavigateAchievements}>
                {t("profile.achievements")}
              </button>
              <button onClick={() => navigate("/collections")}>
                {t("profile.collections")}
              </button>
            </>
          )}
          <div className={styles["stats-section"]}>
            <h3>{t("statistic_panel.bot")}</h3>
            <table className={styles.users}>
              <thead>
                <tr>
                  <th>{t("statistic_panel.wins")}</th>
                  <th>{t("statistic_panel.draws")}</th>
                  <th>{t("statistic_panel.losses")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{profileUser?.botWins || 0}</td>
                  <td>{profileUser?.botDraws || 0}</td>
                  <td>{profileUser?.botLoses || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles["stats-section"]}>
            <h3>{t("statistic_panel.multiplayer")}</h3>
            <table className={styles.users}>
              <thead>
                <tr>
                  <th>{t("statistic_panel.wins")}</th>
                  <th>{t("statistic_panel.draws")}</th>
                  <th>{t("statistic_panel.losses")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{profileUser?.multiWins || 0}</td>
                  <td>{profileUser?.multiDraws || 0}</td>
                  <td>{profileUser?.multiLoses || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {isUpdate && <UpdateForm setIsUpdate={setIsUpdate} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
