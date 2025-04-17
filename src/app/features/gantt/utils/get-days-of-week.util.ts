export default function getDayOfWeek(year: number, month: number, day: number) {
  const daysOfTheWeekArr = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayOfTheWeekIndex = new Date(year, month, day).getDay();
  return daysOfTheWeekArr[dayOfTheWeekIndex];
}
