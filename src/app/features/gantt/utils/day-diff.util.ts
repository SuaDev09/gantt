export default function dayDiff(startDate: Date, endDate: Date) {
  const difference = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
  return days;
}
