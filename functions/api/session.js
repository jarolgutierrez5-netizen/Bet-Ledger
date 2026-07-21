import { json, readSession } from './_auth.js';
export async function onRequestGet({ request, env }) {
  const user = await readSession(request, env.SESSION_SECRET);
  return json({ user });
}
