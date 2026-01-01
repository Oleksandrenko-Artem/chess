import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import { loginSchema } from '../../validation/user.validate';
import { loginUserThunk } from '../../store/usersSlice';
import styles from './form.module.scss';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <Formik initialValues={{email: '', password: ''}} validationSchema={loginSchema} onSubmit={onSubmit} >
            {() => (
                <Form className={styles.form}>
                    <h2>Sign in</h2>
                    {error && error.includes('401') && <p className={styles.error}>Unauthorized</p>}
                    <label>
                        <Field name="email" type="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className={styles.error} />
                    </label>
                    {<label>
                        <Field name="password" type={type} placeholder="Password" />
                        <ErrorMessage name="password" component="div" className={styles.error} />
                        <Icon path={showPassword} size={1.2} onClick={changeType} className={styles['show-password']} />
                    </label>}
                    <button type='submit'>Login</button>
                </Form>
            )}
        </Formik>
    );
}

export default LoginForm;