import React from 'react';
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "formik";
import styles from './Error.module.scss';

const Error = ({ name }) => {
  const { t } = useTranslation();
  return (
    <ErrorMessage name={name}>
      {(msg) => (
        <div className={styles.error}>
          {typeof msg === "string" ? t(msg) : t(msg.key, msg.values)}
        </div>
      )}
    </ErrorMessage>
  );
};

export default Error;