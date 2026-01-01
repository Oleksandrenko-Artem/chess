import * as yup from 'yup';

const nameSchema = yup.string().trim().min(5).max(64);
const emailSchema = yup.string().trim().email();
const passwordSchema = yup.string().trim().min(8).max(125);

export const registerSchema = yup.object({
    name: nameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
});

export const loginSchema = yup.object({
    email: emailSchema,
    password: passwordSchema,
});

export const updateSchema = yup.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});