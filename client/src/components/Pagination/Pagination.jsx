import React from 'react';
import { Icon } from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import styles from './Pagination.module.scss';

const Pagination = (props) => {
    const { page, setPage, total, amount, setAmount } = props;
    const handlePrev = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };
    const handleNext = () => {
        if (page < total / amount) {
            setPage((prevPage) => prevPage + 1);
        }
    };
    const showOption = (option) => <option key={option} value={option}>{option}</option>;
    const handleChange = (event) => {
        setAmount(event.target.value);
        setPage(1);
    };
    return (
        <div className={styles.wrapper}>
            <span onClick={handlePrev} className={styles.arrow}><Icon size={1.5} path={mdiChevronLeft} /></span>
            <span className={styles.page}>{page}</span>
            <span onClick={handleNext} className={styles.arrow}><Icon size={1.5} path={mdiChevronRight} /></span>
        </div>
    );
};

export default Pagination;