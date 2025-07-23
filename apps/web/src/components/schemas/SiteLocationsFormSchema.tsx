import { z } from 'zod';
import { validations } from '@/app/uitexts/validations';

export const siteLocationsSchema = z.object({
  id: z.string(),
  levelName: z.string().optional(),
  driveName: z.string().optional(),
  locationName: z.string().optional(),
});

export type SiteLocationsValue = z.infer<typeof siteLocationsSchema>;

export const driveSchema = z.object({
  id: z.string().optional(),
  driveName: z
    .string()
    .trim() // This automatically trims whitespace
    .max(50, { message: validations.max50Chars('Drive') })
    .refine((val) => val.trim().length >= 2, {
      message: validations.driveWhitespace,
    }),
});

export type DriveValue = z.infer<typeof driveSchema>;

export const levelSchema = z.object({
  id: z.string().optional(),
  levelName: z
    .string()
    .trim()
    .max(50, { message: validations.max50Chars('Level') })
    .refine((val) => val.trim().length >= 2, {
      message: validations.levelWhitespace,
    }),
});

export type LevelValue = z.infer<typeof levelSchema>;

export const locationSchema = z.object({
  id: z.string().optional(),
  locationName: z
    .string()
    .trim()
    .max(50, { message: validations.max50Chars('Location') })
    .refine((val) => val.trim().length >= 2, {
      message: validations.locationWhitespace,
    }),
});

export type LocationValue = z.infer<typeof locationSchema>;
