const Yup = require('yup');

const nameSchema = Yup.string().trim().min(5).max(64);
const emailSchema = Yup.string().trim().email();
const passwordSchema = Yup.string().trim().min(8).max(125);
const avatarSchema = Yup.string().nullable().max(50000000);

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
});