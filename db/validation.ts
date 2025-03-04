import { z } from 'zod';

export const userIdSchema = z.number().int().positive();
export const usernameSchema = z.string().min(3).max(50);
export const passwordSchema = z.string().min(8);

export const userSchema = z.object({
  id: userIdSchema,
  username: usernameSchema,
  password: z.string(),
  createdAt: z.date(),
});

export const newUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const companyIdSchema = z.number().int().positive();
export const companyNameSchema = z.string().min(2).max(100);
export const locationSchema = z.string().min(2).max(200);

export const companySchema = z.object({
  id: companyIdSchema,
  name: companyNameSchema,
  location: locationSchema,
  createdAt: z.date(),
});

export const newCompanySchema = z.object({
  name: companyNameSchema,
  location: locationSchema,
});

export const shiftIdSchema = z.number().int().positive();
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');
export const hourSchema = z
  .string()
  .regex(/^\d{2}:\d{2} - \d{2}:\d{2}$/, 'Hour must be in HH:MM - HH:MM format');
export const positionSchema = z.string().min(2).max(100);
export const serviceDescriptionSchema = z.string().min(5);
export const paymentSchema = z.string().min(1);
export const requirementsSchema = z.string().optional();
export const benefitsSchema = z.string().optional();

export const shiftSchema = z.object({
  id: shiftIdSchema,
  companyId: companyIdSchema,
  date: dateSchema,
  hour: hourSchema,
  position: positionSchema,
  serviceDescription: serviceDescriptionSchema,
  payment: paymentSchema,
  requirements: requirementsSchema,
  benefits: benefitsSchema,
  userId: userIdSchema.nullable(),
  createdAt: z.date(),
});

export const newShiftSchema = z.object({
  companyId: companyIdSchema,
  date: dateSchema,
  hour: hourSchema,
  position: positionSchema,
  serviceDescription: serviceDescriptionSchema,
  payment: paymentSchema,
  requirements: requirementsSchema,
  benefits: benefitsSchema,
  userId: userIdSchema.nullable().optional(),
});

export const shiftAssignmentSchema = z.object({
  shiftId: shiftIdSchema,
  userId: userIdSchema,
});

export const shiftReleaseSchema = z.object({
  shiftId: shiftIdSchema,
  userId: userIdSchema,
});
