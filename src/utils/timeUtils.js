export const convertUTCToLocalTime = (utcDateTimeStr, options = {}) => {
    if (!utcDateTimeStr) return null;

    try {
        const utcDate = new Date(utcDateTimeStr);
        console.log(Intl.DateTimeFormat().resolvedOptions())

        const formatter = new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            ...options
        });

        return formatter.format(utcDate);
    } catch (error) {
        console.error('Time conversion error:', error);
        return 'Invalid date';
    }
};

// console.log(convertUTCToLocalTime("2025-03-13T15:22:20.780137Z"))
