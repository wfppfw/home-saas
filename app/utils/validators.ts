// utils/validators.js
export function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value)
}

export function validatePhone(value: string) {
  return /^1[3-9]\d{9}$/.test(value)
}

export function validateURL(value: string) {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/[\w./?%&=-]*)?$/i.test(value)
}
