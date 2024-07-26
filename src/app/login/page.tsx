// // /app/login/page.tsx
// import { createClient } from "@/lib/supabase/server";
// import { redirect } from 'next/navigation';
// import AuthForm from "@/components/authform";
// import { login, signup } from './action';

// export default async function LoginPage() {
//   const supabase = createClient();
//   const { data: { session } } = await supabase.auth.getSession();

//   if (session) {
//     redirect('/private');
//   }

//   const handleSubmit = async (action: 'login' | 'signup', formData: FormData) => {
//     'use server';
    
//     const result = action === 'login' ? await login(formData) : await signup(formData);
    
//     if (!result.success && result.errors) {
//       return { 
//         success: false, 
//         errors: {
//           email: result.errors.filter(err => err.toLowerCase().includes('email')),
//           password: result.errors.filter(err => err.toLowerCase().includes('password'))
//         }
//       };
//     }
    
//     return { success: true };
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <AuthForm onSubmit={handleSubmit} />
//     </div>
//   );
// }