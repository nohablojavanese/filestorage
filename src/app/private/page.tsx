import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header/Header";
import { redirect } from "next/navigation";
import Home from "../../components/Private";
import AccountForm from "@/components/ProdileEdit";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!session) {
    return redirect("/");
  }

  return (
    <div>
      <Header />
      <Home />
      <AccountForm user={user}/>
    </div>
  );
}
