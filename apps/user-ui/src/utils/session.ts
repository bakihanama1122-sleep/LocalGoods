// In: apps/user-ui/src/utils/session.ts

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import 'server-only'; // Ensures this code only runs on the server

// Define the shape of your user payload within the JWT
interface UserPayload {
  id: string;
  name: string;
  email: string;
  // Add any other user properties you store in the token
}

/**
 * Reads, verifies, and decodes the user session JWT from the request cookies.
 * This function is for use in Server Components only.
 * @returns The decoded user object or null if the session is not valid.
 */
export async function getUserSession(): Promise<UserPayload | null> {
  // 1. Get the session cookie from the browser's request
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token'); // 👈 Use the name of your cookie

  if (!tokenCookie) {
    // If the cookie doesn't exist, the user is not logged in.
    return null;
  }

  const token = tokenCookie.value;

  try {
    // 2. Verify the token using your secret key
    // This checks if the token is valid and hasn't expired.
    const decodedPayload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as UserPayload;

    // 3. If verification is successful, return the user data
    return decodedPayload;
    
  } catch (error) {
    // If the token is invalid (e.g., expired, tampered with), an error will be thrown.
    console.error("Invalid session token:", error);
    return null;
  }
}