import crypto from 'crypto';
import ShortUniqueId from 'short-unique-id';

type Type = 'plain' | 'hash';

/**
 * Function generate plain token
 * @returns Plain crypto token
 */
export const createToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Accept plain token and hashed it using sha256 algorithm.
 * @param token : string: accept plain token
 * @returns hashed token
 */
export const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * The function returns string or array of string. Specify type of plain if you need plain token, tyep:hash and token to hash to get only hashed token. If nothing is specified, it returns array of plain and hashed token ([plain token, hashed token])
 * @param type : string which can either be plain or hash. Where no type it's specified, the function gives back both plain and hashed token.
 * @param token : string: Only required when you want to hashed token
 * @returns string|string[]
 */
export const generateToken = (type?: Type, token?: string) => {
  if (type === 'plain') return createToken();
  if (type === 'hash' && token) return hashToken(token);
  const plainToken = createToken();
  const hashedToken = hashToken(plainToken);
  return [plainToken, hashedToken];
};

/**
 * The function generates unique id and it accepts number specifying the length of the id.
 * @param length : specify how long the short id should be.
 * @returns Unique short id
 */
export const shortID = (length: number) => {
  const uid = new ShortUniqueId({ length });
  return uid.rnd();
};
