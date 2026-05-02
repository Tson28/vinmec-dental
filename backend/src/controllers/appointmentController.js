"use strict";

const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Service = require("../models/Service");
const { sendSuccess, sendError, sendPaginated } = require("../utils/response");
const { getPagination, buildSort } = require("../utils/pagination");

const ALLOWED_SORT = ["date", "time", "status", "createdAt"];

// GET /api/appointments  [admin, doctor]
const getAll = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSort(req.query, ALLOWED_SORT);
    const filter = {};

    if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }
    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.patientId) filter.patient = req.query.patientId;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization")
        .populate("service", "name price duration category")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter),
    ]);

    return sendPaginated(res, appointments, total, page, limit);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/appointments/me  [patient]
const getMine = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { patient: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("doctor", "name email specialization")
        .populate("service", "name price duration")
        .sort({ date: -1, time: -1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter),
    ]);

    return sendPaginated(res, appointments, total, page, limit);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/appointments/:id  [admin, doctor, or patient-owner]
const getById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization")
      .populate("service", "name price duration");

    if (!appointment) return sendError(res, 404, "Appointment not found.");

    if (
      req.user.role === "patient" &&
      appointment.patient._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, "Access denied.");
    }

    return sendSuccess(res, 200, "Appointment retrieved", appointment);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/appointments  [patient]
const create = async (req, res) => {
  try {
    const { doctorId, serviceId, date, time, notes } = req.body;

    // Validate doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return sendError(res, 404, "Doctor not found.");
    }

    // Validate service
    let service = null;
    let serviceName = req.body.serviceName || "General Consultation";
    let fee = 0;
    if (serviceId) {
      service = await Service.findById(serviceId);
      if (service) {
        serviceName = service.name;
        fee = service.price;
      }
    }

    // Check for time conflict on same doctor
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) {
      return sendError(
        res,
        409,
        "This time slot is already booked. Please choose another time.",
      );
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      patientName: req.user.name,
      doctor: doctorId,
      doctorName: doctor.name,
      service: serviceId || undefined,
      serviceName,
      date,
      time,
      duration: service?.duration || 30,
      fee,
      notes,
    });

    await appointment.populate([
      { path: "doctor", select: "name email specialization" },
      { path: "service", select: "name price duration" },
    ]);

    return sendSuccess(
      res,
      201,
      "Appointment booked successfully",
      appointment,
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PUT /api/appointments/:id  [admin, doctor]
const update = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return sendError(res, 404, "Appointment not found.");

    // Doctor can only update their own appointments
    if (
      req.user.role === "doctor" &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, "Access denied. Not your appointment.");
    }

    const allowed = [
      "status",
      "date",
      "time",
      "doctorNotes",
      "notes",
      "duration",
      "isPaid",
      "fee",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) appointment[field] = req.body[field];
    });

    await appointment.save();
    return sendSuccess(res, 200, "Appointment updated", appointment);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PUT /api/appointments/:id/cancel  [patient – cancel own; admin/doctor – cancel any]
const cancel = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return sendError(res, 404, "Appointment not found.");

    if (
      req.user.role === "patient" &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, "Access denied.");
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
      return sendError(
        res,
        400,
        `Cannot cancel an appointment that is already ${appointment.status}.`,
      );
    }

    appointment.status = "cancelled";
    appointment.cancelReason = req.body.reason || "";
    appointment.cancelledBy = req.user.role;
    await appointment.save();

    return sendSuccess(res, 200, "Appointment cancelled", appointment);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// DELETE /api/appointments/:id  [admin]
const remove = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return sendError(res, 404, "Appointment not found.");
    return sendSuccess(res, 200, "Appointment deleted");
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/appointments/stats  [admin, doctor]
const getStats = async (req, res) => {
  try {
    const filter = req.user.role === "doctor" ? { doctor: req.user._id } : {};
    const today = new Date().toISOString().split("T")[0];

    const [total, todayCount, pending, confirmed, completed, cancelled] =
      await Promise.all([
        Appointment.countDocuments(filter),
        Appointment.countDocuments({ ...filter, date: today }),
        Appointment.countDocuments({ ...filter, status: "pending" }),
        Appointment.countDocuments({ ...filter, status: "confirmed" }),
        Appointment.countDocuments({ ...filter, status: "completed" }),
        Appointment.countDocuments({ ...filter, status: "cancelled" }),
      ]);

    return sendSuccess(res, 200, "Appointment stats", {
      total,
      today: todayCount,
      pending,
      confirmed,
      completed,
      cancelled,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/appointments/slots?doctorId=&date=  [auth: all]
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return sendError(
        res,
        400,
        "doctorId and date query params are required.",
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return sendError(res, 400, "date must be in YYYY-MM-DD format.");
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return sendError(res, 404, "Doctor not found.");
    }

    const booked = await Appointment.find({
      doctor: doctorId,
      date,
      status: { $in: ["pending", "confirmed"] },
    }).select("time duration");

    const bookedTimes = new Set(booked.map((a) => a.time));

    const allSlots = [];
    for (let h = 8; h < 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        allSlots.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        );
      }
    }

    const available = allSlots.map((slot) => ({
      time: slot,
      available: !bookedTimes.has(slot),
    }));

    return sendSuccess(res, 200, "Available slots retrieved", {
      doctorId,
      doctorName: doctor.name,
      date,
      slots: available,
      availableCount: available.filter((s) => s.available).length,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

module.exports = {
  getAll,
  getMine,
  getById,
  create,
  update,
  cancel,
  remove,
  getStats,
  getAvailableSlots,
};
