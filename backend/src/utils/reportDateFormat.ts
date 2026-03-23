export const formatReportDates = (startDate: string, endDate: string) => {
  const startingDate = `${startDate}T00:00:00.000Z`;
  const endingDate = `${endDate}T23:59:59.999Z`;

  // const startingDate = new Date(startDate);
  // startingDate.setHours(0, 0, 0, 0);

  // const endingDate = new Date(endDate);
  // endingDate.setDate(endingDate.getDate() + 1);
  // endingDate.setHours(0, 0, 0, 0);

  return [startingDate, endingDate];
};
