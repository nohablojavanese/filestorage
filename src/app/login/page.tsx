import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { login } from "./action";
import { headers } from "next/headers";

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/private");
  }

  const handleSubmit = async (
    action: "login" | "signup",
    formData: FormData
  ) => {
    "use server";

    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    const result =
      action === "login"
        ? await login(formData, ip)
        : await login(formData, ip);

    if (!result.success && result.errors) {
      return {
        success: false,
        errors: {
          email: result.errors.filter((err) =>
            err.toLowerCase().includes("email")
          ),
          password: result.errors.filter((err) =>
            err.toLowerCase().includes("password")
          ),
          general: result.errors.filter(
            (err) =>
              !err.toLowerCase().includes("email") &&
              !err.toLowerCase().includes("password")
          ),
        },
        remainingAttempts: result.remainingAttempts || 0,
      };
    }

    return { success: true, remainingAttempts: result.remainingAttempts || 10 };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black to-gray-900">
      <AuthForm onSubmit={handleSubmit} initialRemainingAttempts={10} />
    </div>
  );
}
