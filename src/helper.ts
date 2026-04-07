export function useHelpers() {
  const containsUppercase = (value: string): boolean => /[A-Z]/.test(value)
  const containsLowercase = (value: string): boolean => /[a-z]/.test(value)
  const containsNumber = (value: string): boolean => /[0-9]/.test(value)
  const containsSpecial = (value: string): boolean => /[#?!@$()`~%^&*-+=]/.test(value)

  return {
    containsUppercase,
    containsLowercase,
    containsNumber,
    containsSpecial,
  }
}
