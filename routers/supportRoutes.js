const express = require('express');
const {
  createSupport,
  deleteSupport,
  getAllSupport,
} = require('../controllers/supportController.js');
const router = express.Router();

// router.use(protect); //  protect all router which are comming after this middleware

router.route('/').get(getAllSupport).post(createSupport);
router.route('/:id').delete(deleteSupport);

module.exports = router;
