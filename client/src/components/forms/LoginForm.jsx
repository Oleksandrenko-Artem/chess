import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import { loginSchema } from '../../validation/user.validate';
import { loginUserThunk } from '../../store/usersSlice';
import styles from './form.module.scss';
import Error from './../Error/Error';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { error } = useSelector((state) => state.users);
    const [type, setType] = useState('password');
    const [showPassword, setShowPassword] = useState(mdiEyeOutline);
    const changeType = () => {
        if (type === 'password') {
            setType('text');
            setShowPassword(mdiEyeOffOutline);
        } else {
            setType('password');
            setShowPassword(mdiEyeOutline);
        }
    };
    const onSubmit = (values) => {
        dispatch(loginUserThunk(values)).unwrap().then(() => {
            navigate('/');
        }).catch((err) => {
            console.log(err);
        });
    };
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form className={styles.form}>
            <h2>Sign in</h2>
            {error && error.includes("404") && (
              <p className={styles.error}>{t("validation.error_unauthorized")}</p>
            )}
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
            <button type="submit">{t("form_panel.login")}</button>
          </Form>
        )}
      </Formik>
    );
}

export default LoginForm;