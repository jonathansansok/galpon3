//frontend\src\lib\api\users.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getUserByEmail(email: string) {
  try {
    const url = `${BACKEND_URL}/api/users/findByEmail?email=${email}`;

    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Error fetching user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !data.email) {
      throw new Error('User not found or invalid response');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unexpected error occurred');
    }
  }
}