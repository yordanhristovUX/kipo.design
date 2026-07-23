/**
 * Generate a bcrypt hash for the admin password.
 *
 * Usage:
 *   node scripts/hash-password.js "your-plaintext-password"
 *
 * Copy the printed hash into ADMIN_PASSWORD_HASH in backend/.env.
 * (Quote the password in the shell so special characters are preserved.)
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "<password>"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log(hash);
