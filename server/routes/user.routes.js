const express = require('express');
const { validate } = require('../middlewares/validate.mw');
const { registerSchema, loginSchema, updateSchema } = require('../validators/user.validator');
const { auth, isOwner } = require('../middlewares/auth.mw');
const { registerUser, loginUser, getUserAccount, getAllUsers, patchUser } = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/account', auth, getUserAccount);
router.get('/', getAllUsers);
router.patch('/:idUser', auth, isOwner, validate(updateSchema), patchUser);

module.exports = router;