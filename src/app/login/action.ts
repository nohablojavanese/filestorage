import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { rateLimit, resetRateLimit } from "@/lib/rateLimit";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function login(formData: FormData, ip: string) {
  const supabase = createClient();

  const rateLimitResult = await rateLimit(ip);
  if (!rateLimitResult.success) {
    return {
      success: false,
      errors: ["Too many login attempts. Please try again later."],
      remainingAttempts: rateLimitResult.remainingAttempts,
    };
  }

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: false,
      errors: parsedData.error.errors.map((err) => err.message),
      remainingAttempts: rateLimitResult.remainingAttempts,
    };
  }

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return {
      success: false,
      errors: [error.message],
      remainingAttempts: rateLimitResult.remainingAttempts,
    };
  }

  await resetRateLimit(ip);
  redirect("/private");
}
