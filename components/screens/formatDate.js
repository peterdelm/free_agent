const formatDate = (inputDate) => {
  // Assuming inputDate is in the format 'YYYY-MM-DD'
  const dateObject = new Date(inputDate);

  // Options for formatting the date
  const options = { month: "short", day: "numeric" };

  // Format the date using toLocaleDateString
  const formattedDate = dateObject.toLocaleDateString(undefined, options);
  return formattedDate;
};

export default formatDate;
