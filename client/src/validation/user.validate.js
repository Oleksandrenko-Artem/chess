import * as yup from 'yup';

const nameSchema = yup.string().trim()
    .min(5, ({ min }) => ({ key: 'validation.name_min', values: { min } }))
    .max(64, ({ max }) => ({ key: 'validation.name_max', values: { max } }));

const emailSchema = yup.string().trim()
    .email('validation.email');

const passwordSchema = yup.string().trim()
    .min(8, ({ min }) => ({ key: 'validation.password_min', values: { min } }))
    .max(125, ({ max }) => ({ key: 'validation.password_min', values: { max } }));

export const registerSchema = yup.object({
    name: nameSchema.required('validation.required'),
    email: emailSchema.required('validation.required'),
    password: passwordSchema.required('validation.required'),
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