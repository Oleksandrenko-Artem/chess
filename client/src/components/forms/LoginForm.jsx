import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import styles from './form.module.scss';

const LoginForm = () => {
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
    const onSubmit = () => { };
    return (
        <Formik initialValues={{email: '', password: ''}} onSubmit={onSubmit} >
            {() => (
                <Form className={styles.form}>
                    <h2>Sign in</h2>
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