export default function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
