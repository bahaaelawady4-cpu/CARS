const express = require('express');
const router = express.Router();
const { createReservation, getMyReservations } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// كل مسارات الحجز محتاجة تسجيل دخول
router.use(protect);

router.route('/')
  .post(createReservation);

router.get('/my-reservations', getMyReservations);

module.exports = router;