import { z } from 'zod';

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
    .min(2, { message: 'Drive name must be at least 2 characters.' })
    .refine((val) => val.trim().length >= 2, {
      message: 'Drive name cannot be mostly whitespace.',
    }),
});

export type DriveValue = z.infer<typeof driveSchema>;

export const levelSchema = z.object({
  id: z.string().optional(),
  levelName: z
    .string()
    .trim()
    .min(2, { message: 'Level name must be at least 2 characters.' })
    .refine((val) => val.trim().length >= 2, {
      message: 'Level name cannot be mostly whitespace.',
    }),
});

export type LevelValue = z.infer<typeof levelSchema>;

export const locationSchema = z.object({
  id: z.string().optional(),
  locationName: z
    .string()
    .trim()
    .min(2, { message: 'Location name must be at least 2 characters.' })
    .refine((val) => val.trim().length >= 2, {
      message: 'Location name cannot be mostly whitespace.',
    }),
});

export type LocationValue = z.infer<typeof locationSchema>;
