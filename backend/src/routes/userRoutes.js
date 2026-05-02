'use strict';

const router = require('express').Router();
const {
  getAll, getById, create, update, remove, toggleActive,
} = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// All user management routes are admin-only
router.use(auth, authorize('admin'));

router.get('/',                    getAll);
router.get('/:id',                 getById);
router.post('/',                   create);
router.put('/:id',                 update);
router.delete('/:id',              remove);
router.put('/:id/toggle-active',   toggleActive);

module.exports = router;