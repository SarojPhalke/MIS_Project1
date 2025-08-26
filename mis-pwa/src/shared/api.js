export async function getUsers() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
  return await response.json();
}
