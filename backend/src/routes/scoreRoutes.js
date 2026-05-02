'use strict';

const router = require('express').Router();
const { getMine, getAll, getByPatient, updateScore } = require('../controllers/scoreController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');

const updateScoreSchema = {
  body: Joi.object({
    overall:          Joi.number().min(0).max(100),
    gumHealth:        Joi.number().min(0).max(100),
    toothDecay:       Joi.number().min(0).max(100),
    alignment:        Joi.number().min(0).max(100),
    cleanliness:      Joi.number().min(0).max(100),
    recommendations:  Joi.array().items(Joi.string()),
    nextCheckupDate:  Joi.string().allow('', null),
    historyNote:      Joi.string().allow('', null),
  }),
};

// Patient views own score
router.get('/me', auth, authorize('patient'), getMine);

// Doctor & Admin: list all + view/update by patient
router.get('/',                        auth, authorize('admin', 'doctor'), getAll);
router.get('/patient/:patientId',      auth, authorize('admin', 'doctor'), getByPatient);
router.put('/patient/:patientId',      auth, authorize('admin', 'doctor'), validate(updateScoreSchema), updateScore);

module.exports = router;