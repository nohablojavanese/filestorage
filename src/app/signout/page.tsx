import { signOut } from "./action"

export default async function SignOutPage() {
  await signOut()
  
  // This return statement is technically unreachable because of the redirect,
  // but we include it to satisfy TypeScript and for cases where redirect might fail
  return null
}