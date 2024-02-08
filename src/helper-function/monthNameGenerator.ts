
function monthNameGenerator(param:any) {
    const dateString = param;
    // Split the date string into month and year parts
    const [monthString, yearString] = dateString.split("-");

    // Parse the month and year parts into numbers
    const monthNumber = parseInt(monthString, 10); // Parse with base 10 to avoid octal parsing
    const yearNumber = parseInt(yearString, 10);

    // Create a Date object using the parsed month and year
    const date = new Date(yearNumber, monthNumber - 1, 1); // Subtract 1 from monthNumber as months are zero-based

    // Get the month name from the Date object
    const monthName = date.toLocaleString('default', { month: 'long' });
    return monthName;
}

export default monthNameGenerator;