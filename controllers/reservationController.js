const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

// @desc    إنشاء حجز جديد
// @route   POST /api/reservations
// @access  Private (لازم يكون مسجل دخول)
exports.createReservation = async (req, res, next) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // 1. التأكد إن العربية موجودة
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'العربية غير موجودة' });
    }

    // 2. تحويل النصوص لتواريخ والتأكد من منطقيتها
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'تاريخ البداية لازم يكون قبل تاريخ النهاية' });
    }

    // 3. منع تداخل الحجوزات (الكود اللي سألت عليه)
    const existingReservation = await Reservation.findOne({
      car: carId,
      status: 'confirmed',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (existingReservation) {
      return res.status(400).json({ 
        success: false, 
        message: 'للأسف العربية محجوزة في الفترة دي، جرب مواعيد تانية' 
      });
    }

    // 4. حساب السعر الإجمالي تلقائياً
    // الفرق بين التاريخين بالملي ثانية مقسوم على عدد الملي ثانية في اليوم
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const totalPrice = diffDays * car.price;

    // 5. حفظ الحجز في قاعدة البيانات
    const reservation = await Reservation.create({
      user: req.user.id, // ID المستخدم اللي جاي من الـ protect middleware
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice: totalPrice,
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب كل حجوزات المستخدم الحالي
// @route   GET /api/reservations/my-reservations
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate('car');
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};