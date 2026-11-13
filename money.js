const SCALE = 100;

export function toSmallestUnit(amount) {
  if (isNaN(amount)) return 0;
  return Math.round(Number(amount) * SCALE);
}

export function fromSmallestUnit(cents) {
  if (isNaN(cents)) return 0;
  return Number((cents / SCALE).toFixed(2));
}

export function formatMoney(amount) {
  const actual = typeof amount === 'number' ? amount : fromSmallestUnit(amount);
  return actual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
