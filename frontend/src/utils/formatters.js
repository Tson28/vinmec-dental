/** Format a date string to a human-readable form */
export function formatDate(dateStr, locale = 'vi-VN') {
    if (!dateStr)
        return '—';
    try {
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    }
    catch {
        return dateStr;
    }
}
/** Format VND currency */
export function formatCurrency(amount, locale = 'vi-VN') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount);
}
/** Format seconds to MM:SS */
export function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
/** Truncate a string to a max length */
export function truncate(str, max = 60) {
    if (!str)
        return '';
    return str.length > max ? str.slice(0, max) + '…' : str;
}
/** Return initials from a full name */
export function initials(name) {
    if (!name)
        return '?';
    return name
        .split(' ')
        .map(w => w.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}
/** Map appointment status to badge variant */
export function statusVariant(status) {
    const map = {
        confirmed: 'blue',
        completed: 'green',
        pending: 'amber',
        cancelled: 'red',
    };
    return map[status] ?? 'gray';
}
