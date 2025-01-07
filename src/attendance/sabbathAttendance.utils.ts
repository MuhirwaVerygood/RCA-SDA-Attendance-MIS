import { parseISO, subDays, getDay } from "date-fns";

// Function to get the previous Sabbath (Saturday)
const getPreviousSabbathDate = (date: string): string => {
    const inputDate = parseISO(date);
    const dayOfWeek = getDay(inputDate); // 0 = Sunday, 6 = Saturday

    // Calculate the difference to the previous Saturday
    const daysToSubtract = dayOfWeek === 6 ? 0 : dayOfWeek + 1;

    // Subtract days to get the previous Saturday
    const previousSabbath = subDays(inputDate, daysToSubtract);

    return previousSabbath.toISOString();
};

// Example attendance records
const attendances = [
    { familyId: 1, submissionDate: "2025-01-04T12:00:00Z" }, // Saturday
    { familyId: 2, submissionDate: "2025-01-03T12:00:00Z" }, // Friday
    { familyId: 3, submissionDate: "2025-01-01T12:00:00Z" }, // Wednesday
    { familyId: 4, submissionDate: "2025-01-05T12:00:00Z" }, // Sunday
];

// Group attendances by Sabbath
const groupedBySabbath = attendances.reduce((group: Record<string, any[]>, record) => {
    const sabbath = getPreviousSabbathDate(record.submissionDate);
    group[sabbath] = group[sabbath] || [];
    group[sabbath].push(record);
    return group;
}, {});

console.log(groupedBySabbath);
