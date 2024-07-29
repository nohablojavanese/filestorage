import { z } from 'zod';

export const ProfileSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name must not exceed 50 characters').nullable(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters').nullable(),
  website: z.string().url('Invalid URL').nullable(),
  avatar_url: z.string().url('Invalid URL').nullable(),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;