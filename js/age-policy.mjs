/* MindCheck age calculations: no date of birth is persisted by this module. */
export function ageFromDateOfBirth(value, today = new Date()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (birth.getUTCFullYear() !== year || birth.getUTCMonth() + 1 !== month || birth.getUTCDate() !== day) return null;
  if (!(today instanceof Date) || Number.isNaN(today.getTime()) || year < 1900) return null;
  const y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate();
  if (year > y || (year === y && (month > m || (month === m && day > d)))) return null;
  return y - year - (m < month || (m === month && d < day) ? 1 : 0);
}
export function ageBand(age) {
  if (!Number.isInteger(age) || age < 0) return null;
  return age >= 18 ? 'adult' : age >= 13 ? 'teen' : 'child';
}
