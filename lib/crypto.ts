import AES from 'react-native-aes-crypto';

/**
 * Derives a key using PBKDF2 from a password and salt.
 * @param password - The password or passphrase to derive the key from.
 * @param salt - A unique salt string, typically the user's ID.
 * @param cost - Number of iterations (default 5000).
 * @param length - Key length in bits (default 256 for AES-256).
 * @returns A hex string representing the derived key.
 */
export const generateKey = async (
  password: string,
  salt: string,
  cost = 5000,
  length = 256
): Promise<string> => {
  return AES.pbkdf2(password, salt, cost, length, 'sha1');
};

/**
 * Encrypts a string using AES-256-CBC.
 * @param text - The plaintext string to encrypt.
 * @param key - The derived encryption key.
 * @param iv - The initialization vector.
 * @returns The encrypted cipher text.
 */
export const encryptData = async (text: string, key: string, iv: string): Promise<string> => {
  return AES.encrypt(text, key, iv, 'aes-256-cbc');
};

/**
 * Decrypts a cipher string using AES-256-CBC.
 * @param cipher - The encrypted data.
 * @param key - The derived key used during encryption.
 * @param iv - The initialization vector used during encryption.
 * @returns The decrypted plaintext.
 */
export const decryptData = async (cipher: string, key: string, iv: string): Promise<string> => {
  return AES.decrypt(cipher, key, iv, 'aes-256-cbc');
};

/**
 * Generates a random 128-bit (16 byte) initialization vector.
 * @returns A hex string representing the IV.
 */
export const generateIV = async (): Promise<string> => {
  return AES.randomKey(16);
};
