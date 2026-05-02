'use strict';

const DentalScore = require('../models/DentalScore');
const User = require('../models/User');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');

// GET /api/scores/me  [patient]
const getMine = async (req, res) => {
  try {
    let score = await DentalScore.findOne({ patient: req.user._id })
      .populate('lastAssessedBy', 'name specialization');

    if (!score) {
      // Auto-create if missing
      score = await DentalScore.create({
        patient: req.user._id,
        patientName: req.user.name,
        overall: 70,
        gumHealth: 70,
        toothDecay: 70,
        alignment: 70,
        cleanliness: 70,
        history: [{ date: new Date().toISOString().split('T')[0], score: 70 }],
      });
    }

    return sendSuccess(res, 200, 'Dental score retrieved', score);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/scores  [admin, doctor]
const getAll = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};
    if (req.query.patientId) filter.patient = req.query.patientId;

    const [scores, total] = await Promise.all([
      DentalScore.find(filter)
        .populate('patient', 'name email')
        .populate('lastAssessedBy', 'name specialization')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      DentalScore.countDocuments(filter),
    ]);

    return sendPaginated(res, scores, total, page, limit);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/scores/patient/:patientId  [doctor, admin]
const getByPatient = async (req, res) => {
  try {
    const score = await DentalScore.findOne({ patient: req.params.patientId })
      .populate('patient', 'name email')
      .populate('lastAssessedBy', 'name specialization');

    if (!score) return sendError(res, 404, 'Dental score not found for this patient.');
    return sendSuccess(res, 200, 'Dental score retrieved', score);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PUT /api/scores/patient/:patientId  [doctor, admin – update score]
const updateScore = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { overall, gumHealth, toothDecay, alignment, cleanliness, recommendations, nextCheckupDate } = req.body;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return sendError(res, 404, 'Patient not found.');
    }

    let score = await DentalScore.findOne({ patient: patientId });

    if (!score) {
      score = new DentalScore({ patient: patientId, patientName: patient.name });
    }

    // Update metrics
    if (overall !== undefined) score.overall = overall;
    if (gumHealth !== undefined) score.gumHealth = gumHealth;
    if (toothDecay !== undefined) score.toothDecay = toothDecay;
    if (alignment !== undefined) score.alignment = alignment;
    if (cleanliness !== undefined) score.cleanliness = cleanliness;
    if (recommendations) score.recommendations = recommendations;
    if (nextCheckupDate) score.nextCheckupDate = nextCheckupDate;

    score.lastAssessedBy = req.user._id;
    score.lastAssessedAt = new Date();

    // Append to history
    const today = new Date().toISOString().split('T')[0];
    const alreadyToday = score.history.some(h => h.date === today);
    if (!alreadyToday && overall !== undefined) {
      score.history.push({ date: today, score: overall, notes: req.body.historyNote });
    }

    await score.save();

    await score.populate([
      { path: 'patient', select: 'name email' },
      { path: 'lastAssessedBy', select: 'name specialization' },
    ]);

    return sendSuccess(res, 200, 'Dental score updated', score);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

module.exports = { getMine, getAll, getByPatient, updateScore };