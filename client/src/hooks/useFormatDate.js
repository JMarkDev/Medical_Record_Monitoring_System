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
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return localDate;
      }
    }
  };

  const formatTime = (time) => {
    if (time) {
      // Split the time string (e.g., "14:57:00")
      const [hours, minutes] = time.split(":");

      // Convert to a 12-hour format
      const hour12 = hours % 12 || 12; // Convert 0 to 12 for midnight
      const period = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

      // Return the formatted time
      return `${hour12}:${minutes} ${period}`;
    }
    return ""; // Return an empty string if no time is provided
  };

  return { dateFormat, fullDateFormat, formatTime };
};
export default useFormat;
