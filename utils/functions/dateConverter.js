function convertDate(postedDate) {
  const dateController = new Date(postedDate);
  const readableDateTime = dateController.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return readableDateTime;
}

export default convertDate;
