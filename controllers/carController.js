const mongoose = require('mongoose');
const Car = require('../models/Car');
require('../models/Category');

// ─── GET ALL CARS ─────────────────────────────────────────────
// @desc    Fetch all cars with advanced filters, search, and pagination
// @route   GET /api/cars
const getAllCars = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        pagination: {},
        data: [],
      });
    }
    let query;

    // 1. عمل نسخة من query للتحكم فيها
    const reqQuery = { ...req.query };

    // 2. حذف الحقول الخاصة من الفلترة الأساسية
    const removeFields = ['keyword', 'sort', 'page', 'limit'];
    removeFields.forEach((param) => delete reqQuery[param]);

    // 3. تحويل الفلترة لـ Mongo Operators (مثل price[gte]=5000)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // 4. البداية بالبحث الأساسي
    query = Car.find(JSON.parse(queryStr)).populate('category', 'name');

    // 5. البحث بكلمة مفتاحية (Keyword Search)
    if (req.query.keyword) {
      const keyword = {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
        ],
      };
      query = query.find(keyword);
    }

    // 6. الترتيب (Sorting)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // الأحدث أولاً افتراضياً
    }

    // 7. منطق الصفحات (Pagination)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // حساب العدد الإجمالي للنتائج المفلترة
    const total = await Car.countDocuments(query.getFilter());

    query = query.skip(startIndex).limit(limit);

    // 8. تنفيذ الاستعلام النهائي
    const cars = await query;

    // 9. بيانات الصفحات (Metadata)
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination,
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE CAR ───────────────────────────────────────────
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate('category', 'name');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: `Car not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE CAR (دعم صور متعددة) ────────────────────────────────
const createCar = async (req, res, next) => {
  try {
    const carData = { ...req.body };
    if (req.files && req.files.length > 0) {
      carData.image = req.files.map(file => `/uploads/${file.filename}`);
    }

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE CAR (دعم صور متعددة) ────────────────────────────────
const updateCar = async (req, res, next) => {
  try {
    const carData = { ...req.body };

    if (req.files && req.files.length > 0) {
      carData.image = req.files.map(file => `/uploads/${file.filename}`);
    }

    const car = await Car.findByIdAndUpdate(req.params.id, carData, {
      new: true, 
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE CAR ───────────────────────────────────────────────
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};