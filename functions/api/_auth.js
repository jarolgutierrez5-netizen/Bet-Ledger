const encoder = new TextEncoder();

function b64url(input) {
  const bytes = input instanceof Uint8Array ? input : encoder.encode(input);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromB64url(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

export async function createSession(user, secret) {
  const payload = b64url(JSON.stringify({ u: user, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 }));
  const signature = b64url(await hmac(secret, payload));
  return `${payload}.${signature}`;
}

export async function readSession(request, secret) {
  const cookie = request.headers.get('Cookie') || '';
  const token = cookie.split(';').map(v => v.trim()).find(v => v.startsWith('bl_session='))?.slice(11);
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = await hmac(secret, payload);
  const actual = fromB64url(signature);
  if (expected.length !== actual.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  if (diff !== 0) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    if (!data.u || data.exp < Date.now()) return null;
    return data.u;
  } catch { return null; }
}

export function sessionCookie(token) {
  return `bl_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1209600`;
}

export function clearSessionCookie() {
  return 'bl_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
}

export async function hashPassword(password, saltB64url) {
  const salt = saltB64url ? fromB64url(saltB64url) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  return { hash: b64url(new Uint8Array(bits)), salt: b64url(salt) };
}

export async function verifyPassword(password, hash, salt) {
  if (!hash || !salt) return false;
  const derived = await hashPassword(password, salt);
  if (derived.hash.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ derived.hash.charCodeAt(i);
  return diff === 0;
}

export async function ensureCredentialColumns(db) {
  for (const stmt of ['ALTER TABLE user_state ADD COLUMN password_hash TEXT', 'ALTER TABLE user_state ADD COLUMN password_salt TEXT']) {
    try {
      await db.prepare(stmt).run();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate column/i.test(message)) throw error;
    }
  }
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
}
