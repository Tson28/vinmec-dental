export const validators = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email address',
    required: (v) => (v && v.trim().length > 0) || 'This field is required',
    minLength: (min) => (v) => v.length >= min || `Must be at least ${min} characters`,
    maxLength: (max) => (v) => v.length <= max || `Must be at most ${max} characters`,
    phone: (v) => /^[0-9+\-\s()]{7,15}$/.test(v) || 'Invalid phone number',
    positiveNumber: (v) => v > 0 || 'Must be a positive number',
    date: (v) => !isNaN(Date.parse(v)) || 'Invalid date',
    futureDate: (v) => new Date(v) > new Date() || 'Date must be in the future',
};
export function validate(value, rules) {
    for (const rule of rules) {
        const result = rule(value);
        if (result !== true)
            return result;
    }
    return null;
}
