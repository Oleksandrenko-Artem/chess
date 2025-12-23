import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <section>
            <h2>Error 404: Page not found!</h2>
            <Link to='/'>Back to home page</Link>
        </section>
    );
};

export default NotFoundPage;