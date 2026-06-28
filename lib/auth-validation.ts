export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPassword(value: string) {
  return value.length >= 8;
}

export function isValidVerificationCode(value: string) {
  return /^[0-9]{4}$/.test(value);
}
