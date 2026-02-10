import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { findUserAccountThunk } from "../store/usersSlice";
import { updateUser } from "../api";
import styles from "./Pages.module.scss";

const ProfilePage = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
  const { user, error } = useSelector((state) => state.users);
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    if (!user) {
      dispatch(findUserAccountThunk());
    } else {
      setAvatar(user.avatar);
    }
  }, [dispatch, user]);
  if (error) {
    navigate("/login");
  }
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
      console.log("Avatar uploaded successfully:", response.data);
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
      console.log("Avatar removed:", response.data);
      setAvatar(null);
      dispatch(findUserAccountThunk());
    } catch (err) {
      console.error("Error removing avatar:", err);
      alert(`Failed to remove avatar: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className={styles.profile}>
      <h2>{t("profile.profile")}</h2>
      <div className={styles["profile-wrapper"]}>
        <div>
          {avatar && (
            <div>
              <img
                src={avatar}
                alt="Profile Avatar"
                className={styles["profile-avatar"]}
              />
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? `${t("profile.upload_photo")}` : `${t("profile.change_photo")}`}
                </button>
                <button
                  onClick={removeAvatar}
                  disabled={isUploading}
                >
                  {t("profile.remove_photo")}
                </button>
              </div>
            </div>
          )}
          {!avatar && (
            <div>
              <img src="src/assets/icons/account.png" alt="Default Avatar" className={styles["default-avatar"]} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? `${t("profile.upload_photo")}` : `${t("profile.change_photo")}`}
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.ico,.svg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
        <div>
          <p>
            <b>{t("profile.name")}:</b> {user?.name}
          </p>
          <p>
            <b>{t("profile.email")}:</b> {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
