"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export default function UserProfile() {
  const supabase = createClient();
  const [user, setUser] = useState<{
    email: string | null;
    role: string | null;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({
          email: user.email ?? null,
          role: user.role ?? "No role", // Provide a default value if role is undefined
        });
      }
    };

    fetchUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signout");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col">
        <span>Email: {user.email}</span>
        <span>Role: {user.role}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
