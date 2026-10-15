import { z } from "zod";

const profileDateSchema = z
  .iso
  .date()
  .refine(
    (value) => value < new Date().toISOString().slice(0, 10),
    "Date of birth must be in the past"
  );

const updateProfileBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7, "Phone number is too short")
      .max(20, "Phone number cannot exceed 20 characters")
      .optional(),

    dateOfBirth: profileDateSchema.optional(),

    gender: z
      .enum(["male", "female"])
      .optional(),

    address: z
      .string()
      .trim()
      .min(5, "Address must contain at least 5 characters")
      .max(300, "Address cannot exceed 300 characters")
      .optional(),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    body: updateProfileBodySchema,

    file: z
      .object({
        mimetype: z.enum([
          "image/jpeg",
          "image/png",
          "image/webp",
        ]),
        size: z.number().max(5 * 1024 * 1024),
      })
      .optional(),
  })
  .refine(
    ({ body, file }) =>
      Object.keys(body).length > 0 || Boolean(file),
    {
      message: "Provide at least one field or a profile image to update",
      path: ["body"],
    }
  );


export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string()
        .min(1, "Current password is required")
        .max(128, "Current password cannot exceed 128 characters"),

      newPassword: z
        .string()
        .min(8, "New password must contain at least 8 characters")
        .max(128, "New password cannot exceed 128 characters"),
    })
    .strict()
    .refine(
      (data) => data.currentPassword !== data.newPassword,
      {
        message: "New password must be different from current password",
        path: ["newPassword"],
      }
    ),
});
