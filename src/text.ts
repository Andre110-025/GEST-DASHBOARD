function addNumbers(a: number, b: number): number {
  return a + b
}

// ✅ Correct usage
console.log(addNumbers(2, 3))

// ❌ Wrong usage (TS should complain here)
// console.log(addNumbers('2', '3'))
