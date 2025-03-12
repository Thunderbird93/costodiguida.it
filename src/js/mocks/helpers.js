export function getEngineKwPower(power, unit) {
  if (!power || power <= 0) return 0;

  const conversionFactor = 0.73549875;
  return unit === "cv" ? Math.round(power * conversionFactor) : power;
}

export function num(val) {
  return +Number.parseFloat(val).toFixed(2);
}
