const Yup = require('yup');

const nameSchema = Yup.string().trim().min(5).max(64);
const emailSchema = Yup.string().trim().email();
const passwordSchema = Yup.string().trim().min(8).max(125);
const avatarSchema = Yup.string().nullable().max(50000000);
const numberSchema = Yup.number().integer().min(0);

module.exports.registerSchema = Yup.object({
    name: nameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
});

module.exports.loginSchema = Yup.object({
    email: emailSchema.required(),
    password: passwordSchema.required(),
});

module.exports.updateSchema = Yup.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    avatar: avatarSchema,
    wins: numberSchema,
    draws: numberSchema,
    loses: numberSchema,
    botWins: numberSchema,
    botDraws: numberSchema,
    botLoses: numberSchema,
    multiWins: numberSchema,
    multiDraws: numberSchema,
    multiLoses: numberSchema,
});