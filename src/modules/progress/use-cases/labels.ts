export function weekdayLabel(date: Date): string {
  const raw = new Intl.DateTimeFormat('es', { weekday: 'short' }).format(date).replace('.', '');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function dayMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
    .format(date)
    .replace('.', '');
}
