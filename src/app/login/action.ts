"use server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email macam apa ini?"),
  password: z.string().min(6, "Password kok macam ini, min 6 karakter"),
});

const signupSchema = z.object({
  email: z.string().email("Email macam apa ini?"),
  password: z.string().min(6, "Password kok macam ini, min 6 karakter"),
});

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.errors.map((err) => err.message) };
  }

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return { success: false, errors: [error.message] };
  }

  redirect('/private');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsedData = signupSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.errors.map((err) => err.message) };
  }

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    return { success: false, errors: [error.message] };
  }

  redirect('/private');
}