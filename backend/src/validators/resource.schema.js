import { z } from "zod";

// ---------- Shared helpers ----------

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const dateSchema = z.coerce.date();

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Time must use HH:mm format"
  );

const optionalUrlSchema = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional();

const imageFileSchema = z
  .object({
    mimetype: z.enum([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]),
    size: z.number().max(5 * 1024 * 1024),
  })
  .optional();

const withFile = (body) =>
  z.object({
    body,
    file: imageFileSchema,
  });

const requireAtLeastOneField = (schema) =>
  schema.refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update"
  );

// ---------- Teaching ----------

const teachingFields = {
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().max(1000),
  preacher: z.string().trim().min(4).max(100),
  duration: z.preprocess(
    (value) => {
    if (value === "" || value === null) return undefined;
        return value;
        },
        z.coerce.number().min(1).optional()
    ),
  date: dateSchema,
  service: objectIdSchema.nullable().optional(),
  series: objectIdSchema.nullable().optional(),
  videoUrl: optionalUrlSchema.optional(),
  audioUrl: optionalUrlSchema.optional(),
  department: objectIdSchema,
};

const teachingCreateBody = z.object(teachingFields).strict();

const teachingUpdateBody = requireAtLeastOneField(
  z.object(teachingFields).partial().strict()
);

export const createTeachingSchema = withFile(teachingCreateBody);
export const updateTeachingSchema = withFile(teachingUpdateBody);

// ---------- Teaching Series ----------

const seriesFields = {
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(2200),
  date: dateSchema,
};

export const createTeachingSeriesSchema = withFile(
  z.object(seriesFields).strict()
);

export const updateTeachingSeriesSchema = withFile(
  requireAtLeastOneField(
    z.object(seriesFields).partial().strict()
  )
);

// ---------- Service ----------

const serviceTypes = [
  "Teaching",
  "Celebration",
  "Interactive Study",
  "Holy Ghost",
  "Thanksgiving",
  "Prayer",
  "Pulpit Exchange",
  "Healing and Communion",
  "Other",
];

const serviceDays = [
  "Sunday",
  "Wednesday",
  "Friday",
  "Saturday",
];

const serviceFields = {
  title: z.string().trim().min(1).max(100),
  theme: z.string().trim().min(1).max(200),
  preacher: z.string().trim().max(150).optional(),
  serviceType: z.enum(serviceTypes),
  description: z.string().trim().max(5000),
  location: z.string().trim().min(1).max(300),
  day: z.enum(serviceDays),
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
};

const serviceTimeCheck = (data, ctx) => {
  if (
    data.startTime &&
    data.endTime &&
    data.startTime >= data.endTime
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["endTime"],
      message: "End time must be after start time",
    });
  }
};

export const createServiceSchema = withFile(
  z.object(serviceFields).strict().superRefine(serviceTimeCheck)
);

export const updateServiceSchema = withFile(
  requireAtLeastOneField(
    z.object(serviceFields).partial().strict()
  ).superRefine(serviceTimeCheck)
);

// ---------- Event ----------

const eventFields = {
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(5000),
  startDate: dateSchema,
  endDate: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  location: z.string().trim().min(1).max(300),
  host: z.string().trim().min(1).max(150),
  guestMinisters: z
    .array(z.string().trim().min(1).max(150))
    .optional(),
};

const eventDateCheck = (data, ctx) => {
  if (
    data.startDate &&
    data.endDate &&
    data.endDate < data.startDate
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "End date cannot be before start date",
    });
  }
};

export const createEventSchema = withFile(
  z.object(eventFields).strict().superRefine(eventDateCheck)
);

export const updateEventSchema = withFile(
  requireAtLeastOneField(
    z.object(eventFields).partial().strict()
  ).superRefine(eventDateCheck)
);

// ---------- Department ----------

const departmentFields = {
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(3000),
  leader: objectIdSchema.nullable().optional(),
};

export const createDepartmentSchema = withFile(
  z.object(departmentFields).strict()
);

export const updateDepartmentSchema = withFile(
  requireAtLeastOneField(
    z.object(departmentFields).partial().strict()
  )
);
