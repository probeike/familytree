import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';

// Configuration
const SESSION_COOKIE_NAME = 'family-tree-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Environment variables for password hashes
// These should be set in environment variables for security
const PASSWORD_HASHES = {
  main: process.env.FAMILY_TREE_PASSWORD_HASH || '',
  // Add additional password hashes as needed
};

// For GitHub Actions, the password might be passed directly
const GITHUB_PASSWORD = process.env.FAMILY_TREE_PASSWORD || '';

/**
 * Hash a password using bcrypt
 * This is used for initial password setup/testing
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Authenticate user with password (client-side - calls API)
 */
export async function authenticateWithPassword(password: string): Promise<boolean> {
  if (!password) {
    return false;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Authentication request failed:', error);
    return false;
  }
}

/**
 * Create a session token
 */
export function createSessionToken(): string {
  const timestamp = Date.now();
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const randomString = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${timestamp}-${randomString}`;
}

/**
 * Set authentication session
 */
export function setAuthSession(token: string): void {
  const expirationDate = new Date(Date.now() + SESSION_DURATION);
  
  Cookies.set(SESSION_COOKIE_NAME, token, {
    expires: expirationDate,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
}

/**
 * Get current session token
 */
export function getSessionToken(): string | undefined {
  try {
    return Cookies.get(SESSION_COOKIE_NAME);
  } catch (error) {
    // Handle SSR or cookie access issues
    return undefined;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getSessionToken();
  if (!token) return false;

  // Parse timestamp from token
  const [timestampStr] = token.split('-');
  const timestamp = parseInt(timestampStr, 10);
  
  if (isNaN(timestamp)) return false;

  // Check if session has expired
  const now = Date.now();
  const sessionExpired = now - timestamp > SESSION_DURATION;
  
  if (sessionExpired) {
    clearAuthSession();
    return false;
  }

  return true;
}

/**
 * Clear authentication session
 */
export function clearAuthSession(): void {
  Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Login with password
 */
export async function login(password: string): Promise<boolean> {
  const isValid = await authenticateWithPassword(password);
  
  if (isValid) {
    const token = createSessionToken();
    setAuthSession(token);
    return true;
  }
  
  return false;
}

/**
 * Logout user
 */
export function logout(): void {
  clearAuthSession();
}

/**
 * Refresh session if valid
 */
export function refreshSession(): boolean {
  if (isAuthenticated()) {
    const token = createSessionToken();
    setAuthSession(token);
    return true;
  }
  return false;
}

/**
 * Security helper: Generate password hash for setup
 * This is a utility function for administrators to generate password hashes
 */
export async function generatePasswordHashForSetup(password: string): Promise<string> {
  console.log('Generated password hash:', await hashPassword(password));
  return await hashPassword(password);
}

/**
 * Validate session token format
 */
export function isValidTokenFormat(token: string): boolean {
  const tokenPattern = /^\d+-[a-f0-9]{32}$/;
  return tokenPattern.test(token);
}

/**
 * Get session expiration time
 */
export function getSessionExpiration(): Date | null {
  const token = getSessionToken();
  if (!token || !isValidTokenFormat(token)) return null;

  const [timestampStr] = token.split('-');
  const timestamp = parseInt(timestampStr, 10);
  
  if (isNaN(timestamp)) return null;
  
  return new Date(timestamp + SESSION_DURATION);
}