import { z } from 'zod';

export const registerSchema = z.object(
    {
        firstName: z
            .string()
            .trim()
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be at most 50 characters"),
        
        lastName: z
            .string()
            .trim()
            .max(50, "Last name must be at most 50 characters")
            .optional(),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address"),

        password: z
            .string()
            .min(8, "Must contain minimum 8 characters")
            .max(128)
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[a-z]/, "Must contain a lowercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character")
    }
)

export const loginSchema = z.object(
    {
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address"),

        password: z
            .string()
            .min(8, "Must contain minimum 8 characters")
            .max(128)
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[a-z]/, "Must contain a lowercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character")
    }
)

export const passwordSchema = z.object(
    {
        password: z
            .string()
            .min(8, "Must contain minimum 8 characters")
            .max(128)
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[a-z]/, "Must contain a lowercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character")
    }
)