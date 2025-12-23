const express = require('express');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/account', getUserAccount);

module.exports = router;