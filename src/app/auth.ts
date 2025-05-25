// app/auth.ts
import { auth } from "@clerk/nextjs/server";

export const getAuthUser = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    const signInUrl = new URL('/sign-in', process.env.NEXT_PUBLIC_BASE_URL);
    return { redirect: signInUrl.toString() };
  }
  
  return { userId };
};