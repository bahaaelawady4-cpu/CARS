const express = require('express');
const router = express.Router();

// استيراد الدوال من الـ Controller
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');

// استيراد الـ Middlewares
const validateCar = require('../middleware/carValidator');
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

// المسار: /api/cars
router.route('/')
  .get(getAllCars)
  // لاحظ هنا استخدمنا upload.array بدلاً من single لدعم الصور المتعددة
  .post(protect, authorize('admin'), upload.array('images', 5), validateCar, createCar);

// المسار: /api/cars/:id
router.route('/:id')
  .get(getCarById)
  .put(protect, authorize('admin'), upload.array('images', 5), validateCar, updateCar)
  .delete(protect, authorize('admin'), deleteCar);

module.exports = router;