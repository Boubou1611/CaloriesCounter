const DayName = () => {
  const date = new Date();
  const weekDay = date.getDay();
  const daysNames = [
    "sunday",
    "monday",
    "thursday",
    "wednesday",
    "tuesday",
    "friday",
    "saturday",
  ];
  const dayName = daysNames[weekDay];
  return dayName;
};
export default DayName;
