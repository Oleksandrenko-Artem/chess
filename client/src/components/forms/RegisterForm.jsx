import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import styles from './form.module.scss';

const RegisterForm = () => {
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
    const onSubmit = () => {}
    return (
        <Formik initialValues={{name: '', email: '', password: ''}} onSubmit={onSubmit}>
            {() => (
                <Form className={styles.form}>
                    <h2>Sign up</h2>
                    <label>
                        <Field name="name" type="text" placeholder="Name" />
                        <ErrorMessage name="name" component="div" />
                    </label>
                    <label>
                        <Field name="email" type="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" />
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