export const useFormat = () => {
  const dateFormat = (date) => {
    // Check if date is null or undefined
    if (!date) {
      return ""; // or return a default value, such as 'N/A'
    }

    // Check if the input is in the {val: "'YYYY/MM/DD HH:MM:SS'"} format
    if (typeof date === "object" && date.val) {
      // Extract the actual date string and remove any single quotes
      date = date.val.replace(/'/g, ""); // Remove the extra quotes
    }

    const parsedDate = new Date(date);

    // Additional safety check for valid date string
    if (!isNaN(parsedDate)) {
      const localDate = parsedDate.toLocaleString("en-US", {
        timeZone: "Asia/Manila", // Set to your local time zone (Philippine Standard Time)
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Use 12-hour format
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return localDate;
    }

    return ""; // Fallback if the date format is incorrect
  };

  const fullDateFormat = (date) => {
    if (date) {
      // Check if date is null or undefined
      if (!date) {
        return ""; // or return a default value, such as 'N/A'
      }

      // Check if the input is in the {val: "'YYYY/MM/DD HH:MM:SS'"} format
      if (typeof date === "object" && date.val) {
        // Extract the actual date string and remove any single quotes
        date = date.val.replace(/'/g, ""); // Remove the extra quotes
      }

      const parsedDate = new Date(date);

      if (!isNaN(parsedDate)) {
        const localDate = parsedDate.toLocaleString("en-US", {
          timeZone: "Asia/Manila", // Set to your local time zone (Philippine Standard Time)
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        return localDate;
      }
    }
  };

  return { dateFormat, fullDateFormat };
};
export default useFormat;
