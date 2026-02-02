import React, { useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from 'formik';
import { Icon } from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import { registerSchema } from '../../validation/user.validate';
import { registerUserThunk } from '../../store/usersSlice';
import styles from './form.module.scss';
import Error from '../Error/Error';

const RegisterForm = () => {
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
        dispatch(registerUserThunk(values)).unwrap().then(() => {
            navigate('/login');
        }).catch((err) => {
            console.log(err);
        });
    };
    return (
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={registerSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form className={styles.form}>
            <h2>Sign up</h2>
            {error && error.includes("409") && (
              <p className={styles.error}>{t("validation.error_email")}</p>
            )}
            <label>
              <Field
                name="name"
                type="text"
                placeholder={t("form_panel.name")}
              />
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
            <button type="submit">{t("form_panel.register")}</button>
          </Form>
        )}
      </Formik>
    );
}

export default RegisterForm;