import React, { useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import { registerSchema } from '../../validation/user.validate';
import { registerUserThunk } from '../../store/usersSlice';
import styles from './form.module.scss';

const RegisterForm = () => {
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
        dispatch(registerUserThunk(values)).unwrap().then(() => {
            navigate('/login');
        }).catch((err) => {
            console.log(err);
        });
    };
    return (
        <Formik initialValues={{name: '', email: '', password: ''}} validationSchema={registerSchema} onSubmit={onSubmit}>
            {() => (
                <Form className={styles.form}>
                    <h2>Sign up</h2>
                    {error && error.includes('409') && <p className={styles.error}>Email already exists</p>}
                    <label>
                        <Field name="name" type="text" placeholder="Name" />
                        <ErrorMessage name="name" component="div" className={styles.error} />
                    </label>
                    <label>
                        <Field name="email" type="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className={styles.error} />
                    </label>
                    {<label>
                        <Field name="password" type={type} placeholder="Password" />
                        <ErrorMessage name="password" component="div" className={styles.error} />
                        <Icon path={showPassword} size={1.2} onClick={changeType} className={styles['show-password']} />
                    </label>}
                    <button type='submit'>Register</button>
                </Form>
            )}
        </Formik>
    );
}

export default RegisterForm;