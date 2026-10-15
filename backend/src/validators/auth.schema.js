
import { z } from "zod";


const registerBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(4, "Name must contain at least 4 characters")
      .max(25, "Name cannot exceed 25 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    phone: z
      .string()
      .trim()
      .min(11, "Phone number is too short")
      .max(13, "Phone number cannot exceed 13 characters"),

    password: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(20, "Password cannot exceed 20 characters"),

    dateOfBirth: z
      .iso
      .datetime({ offset: true })
      .or(z.iso.date())
      .pipe(
        z.coerce.date({
          error: "Please provide a valid date of birth",
        })
      )
      .refine(
        (date) => date < new Date(),
        "Date of birth must be in the past"
      ),

    gender: z.enum(["male", "female"], {
      error: "Gender must be male or female",
    }),

    address: z
      .string()
      .trim()
      .min(5, "Address must contain at least 5 characters")
      .max(150, "Address cannot exceed 150 characters"),
  })
  .strict();


const loginBodySchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .max(20, "Password cannot exceed 128 characters"),
  })
  .strict();

export const registerSchema = z.object({
  body: registerBodySchema,
});

export const loginSchema = z.object({
  body: loginBodySchema,
});