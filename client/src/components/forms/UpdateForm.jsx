import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import { Icon } from "@mdi/react";
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { updateSchema } from "../../validation/user.validate";
import { updateUserThunk } from "../../store/usersSlice";
import styles from "./form.module.scss";
import Error from "../Error/Error";

const UpdateForm = (props) => {
  const { setIsUpdate } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, error } = useSelector((state) => state.users);
  const [type, setType] = useState("password");
  const [showPassword, setShowPassword] = useState(mdiEyeOutline);
  const changeType = () => {
    if (type === "password") {
      setType("text");
      setShowPassword(mdiEyeOffOutline);
    } else {
      setType("password");
      setShowPassword(mdiEyeOutline);
    }
  };
    const onSubmit = (values) => {
      const data = {};
      if (values.name) {
        data.name = values.name;
      }
      if (values.email) {
        data.email = values.email;
      }
      if (values.password) {
        data.password = values.password;
      }
      dispatch(updateUserThunk({ id: user._id, values: data }))
      .unwrap()
      .catch((err) => {
        console.log(err);
      });
      setIsUpdate(false);
  };
  return (
    <Formik
      initialValues={{ name: user?.name, email: user?.email, password: "" }}
      validationSchema={updateSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className={styles.form}>
          <h3>{t("form_panel.update_form")}</h3>
          {error && error.includes("409") && (
            <p className={styles.error}>{t("validation.error_email")}</p>
          )}
          <label>
            <Field name="name" type="text" placeholder={t("form_panel.name")} />
          </label>
          <label>
            <Error name="name" />
          </label>
          <label>
            <Field
              name="email"
              type="email"
              placeholder={t("form_panel.email")}
            />
          </label>
          <label>
            <Error name="email" />
          </label>
          {
            <label>
              <Field
                name="password"
                type={type}
                placeholder={t("form_panel.password")}
              />
              <Icon
                path={showPassword}
                size={1.2}
                onClick={changeType}
                className={styles["show-password"]}
              />
            </label>
          }
          <label>
            <Error name="password" />
          </label>
          <button type="submit">{t("form_panel.update")}</button>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateForm;
