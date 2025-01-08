import { parseISO, getDay, addDays, startOfMonth } from "date-fns";

// Function to get the previous Sabbath (Saturday)
export function getPreviousSabbathDate(currentDate: Date): Date {
    const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const daysSinceSabbath = day === 6 ? 0 : day + 1;
    const lastSabbath = new Date(currentDate);
    lastSabbath.setDate(currentDate.getDate() - daysSinceSabbath);
    return lastSabbath;
}

// Example attendance records
const attendances = [
    { familyId: 1, submissionDate: "2025-01-04T12:00:00Z" }, // Saturday
    { familyId: 2, submissionDate: "2025-01-03T12:00:00Z" }, // Friday
    { familyId: 3, submissionDate: "2025-01-01T12:00:00Z" }, // Wednesday
    { familyId: 4, submissionDate: "2025-01-05T12:00:00Z" }, // Sunday
];

// Group attendances by Sabbath
export const groupedBySabbath = attendances.reduce((group: Record<string, any[]>, record) => {
    const sabbath = getPreviousSabbathDate(new Date(record.submissionDate)); // Convert string to Date
    const sabbathKey = sabbath.toISOString(); // Use ISO string as the key
    group[sabbathKey] = group[sabbathKey] || [];
    group[sabbathKey].push(record);
    return group;
}, {});

console.log(groupedBySabbath);


//Get sabbath nth in a month 
export const getSaturdayOccurrence = (date: string): number => {
    const inputDate = parseISO(date);
    const dayOfWeek = getDay(inputDate);

    // Ensure the input date is a Saturday
    if (dayOfWeek !== 6) {
        throw new Error("The provided date is not a Saturday.");
    }

    // Get the first day of the month
    const firstDayOfMonth = startOfMonth(inputDate);

    // Find the first Saturday of the month
    const firstSaturday =
        getDay(firstDayOfMonth) === 6
            ? firstDayOfMonth
            : addDays(firstDayOfMonth, (6 - getDay(firstDayOfMonth)));

    // Calculate the difference in days between the input date and the first Saturday
    const daysDifference = Math.floor((inputDate.getTime() - firstSaturday.getTime()) / (1000 * 60 * 60 * 24));

    // Determine the occurrence (0-based difference divided by 7)
    const occurrence = Math.floor(daysDifference / 7) + 1;

    return occurrence;
};

// Example usage
try {
    const saturday = "2025-01-04T00:00:00Z"; // Example Saturday
    const result = getSaturdayOccurrence(saturday);
    console.log(result); // Output: "The provided Saturday is the 1st Saturday of the month."
} catch (error) {
    console.error(error.message);
}