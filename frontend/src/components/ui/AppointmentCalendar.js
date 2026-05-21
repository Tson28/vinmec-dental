import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
const statusColor = {
    pending: "bg-amber-50 border-amber-300 text-amber-900",
    confirmed: "bg-blue-50 border-blue-300 text-blue-900",
    completed: "bg-green-50 border-green-300 text-green-900",
    cancelled: "bg-red-50 border-red-300 text-red-900",
};
const statusBgColor = {
    pending: "bg-amber-400",
    confirmed: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
};
export default function AppointmentCalendar({ appointments, onSelectAppointment, loading, }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    // Get start of week (Sunday)
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };
    const weekStart = getStartOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return date;
    });
    const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8:00 - 19:00
    // Parse appointment time and date
    const appointmentsByDay = useMemo(() => {
        const map = {};
        weekDays.forEach((day) => {
            const key = day.toISOString().split("T")[0];
            map[key] = [];
        });
        (appointments || []).forEach((apt) => {
            const aptDate = apt.date; // Assuming date is in YYYY-MM-DD format
            if (map[aptDate]) {
                map[aptDate].push(apt);
            }
        });
        return map;
    }, [appointments, weekDays]);
    const getAppointmentPosition = (appointment) => {
        const [hours, minutes] = appointment.time.split(":").map(Number);
        const startHour = 8;
        const top = (((hours - startHour) * 60 + minutes) / 60) * 64; // 64px per hour
        return top;
    };
    const nextWeek = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 7);
        setCurrentDate(date);
    };
    const prevWeek = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 7);
        setCurrentDate(date);
    };
    const goToday = () => {
        setCurrentDate(new Date());
    };
    const isToday = (date) => {
        const today = new Date();
        return (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear());
    };
    if (loading) {
        return (_jsx("div", { className: "card p-6", children: _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("p", { className: "text-surface-500", children: "Loading calendar..." }) }) }));
    }
    return (_jsxs("div", { className: "card p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-display font-bold text-lg text-surface-900", children: "L\u1ECBch kh\u00E1m" }), _jsx("p", { className: "text-sm text-surface-500", children: weekStart.toLocaleDateString("vi-VN", {
                                    month: "long",
                                    year: "numeric",
                                }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: prevWeek, className: "p-2 hover:bg-surface-100 rounded-lg transition", title: "Previous week", children: _jsx("span", { className: "text-xl text-surface-600", children: "\u2039" }) }), _jsx("button", { onClick: goToday, className: "px-3 py-1 text-sm bg-dental-50 text-dental-600 rounded-lg hover:bg-dental-100 transition font-medium", children: "H\u00F4m nay" }), _jsx("button", { onClick: nextWeek, className: "p-2 hover:bg-surface-100 rounded-lg transition", title: "Next week", children: _jsx("span", { className: "text-xl text-surface-600", children: "\u203A" }) })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("div", { className: "min-w-full", children: [_jsxs("div", { className: "grid grid-cols-8 gap-1 mb-2", children: [_jsx("div", { className: "w-16 flex-shrink-0" }), weekDays.map((day) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs font-semibold text-surface-600 uppercase", children: day.toLocaleDateString("vi-VN", { weekday: "short" }) }), _jsx("div", { className: `text-sm font-bold py-1 rounded ${isToday(day)
                                                ? "bg-dental-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                                                : "text-surface-900"}`, children: day.getDate() })] }, day.toISOString())))] }), _jsxs("div", { className: "grid grid-cols-8 gap-1 bg-surface-50 p-2 rounded-lg relative", children: [_jsx("div", { className: "w-16 flex-shrink-0", children: hours.map((hour) => (_jsxs("div", { className: "h-16 text-xs text-surface-500 font-medium border-r border-surface-200 pr-2 text-right", children: [hour, ":00"] }, hour))) }), weekDays.map((day) => {
                                    const dayKey = day.toISOString().split("T")[0];
                                    const dayAppointments = appointmentsByDay[dayKey] || [];
                                    const isTodayColumn = isToday(day);
                                    return (_jsxs("div", { className: `relative border-l border-surface-200 ${isTodayColumn ? "bg-dental-50" : "bg-white"}`, children: [hours.map((hour) => (_jsx("div", { className: "h-16 border-b border-surface-200 relative hover:bg-surface-100 transition cursor-pointer" }, hour))), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: dayAppointments.map((apt, idx) => (_jsx("div", { className: "absolute w-full left-0 px-1 pointer-events-auto", style: {
                                                        top: `${getAppointmentPosition(apt)}px`,
                                                    }, children: _jsxs("button", { onClick: () => onSelectAppointment && onSelectAppointment(apt), className: `w-full text-left p-2 rounded border-l-4 text-xs font-medium truncate transition hover:shadow-md ${statusColor[apt.status]} ${statusBgColor[apt.status]} border-l-4`, style: {
                                                            borderLeftColor: statusBgColor[apt.status],
                                                            marginTop: idx > 0 ? `${idx * 2}px` : "0", // Small offset for overlapping
                                                        }, title: `${apt.patientName || "Patient"} - ${apt.time}`, children: [_jsx("div", { className: "font-semibold", children: apt.patientName || "Patient" }), _jsxs("div", { className: "text-xs opacity-80", children: [apt.time, apt.service &&
                                                                        ` - ${typeof apt.service === "string" ? apt.service : apt.service.name}`] })] }) }, apt.id))) })] }, dayKey));
                                })] })] }) }), _jsx("div", { className: "mt-6 flex flex-wrap gap-4", children: Object.entries(statusColor).map(([status, classes]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded border-l-2 ${classes}`, style: { borderLeftColor: statusBgColor[status] } }), _jsx("span", { className: "text-xs text-surface-600", children: status.charAt(0).toUpperCase() + status.slice(1) })] }, status))) })] }));
}
