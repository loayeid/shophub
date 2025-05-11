'use server'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

function getAuthUser() {
  const cookieStore = cookies();
  
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  try {
    const user = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "default_secret"
    );
    return user;
  } catch {
    return null;
  }
}

export default getAuthUser;
