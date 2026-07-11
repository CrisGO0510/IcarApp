import { parseDateKey } from 'src/core/utils/dateKey';

export function calculateAge(birthDate: string, now: Date): number {
  const birth = parseDateKey(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}
