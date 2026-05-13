const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { clean: xssClean } = require('xss-clean/lib/xss');

// استيراد الـ Middleware الخاص بمعالجة الأخطاء
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// ─── 1. الأساسيات (Standard Middleware) ────────────────────────
// يجب أن تكون في البداية ليتمكن السيرفر من قراءة البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ─── 2. طبقات الحماية (Security Layer) ──────────────────────────

// حماية الـ HTTP Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// ✅ الحل النهائي لمشكلة الـ Crash: تنظيف البيانات بدون إعادة كتابة الـ Query بالكامل
const sanitizeRequest = (options = {}) => (req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (!req[key]) return;
    if (key === 'query') {
      // Express 5 makes req.query a getter-only property, طالما لا نعيد الكتابة، يُنجح
      mongoSanitize.sanitize(req.query, options);
    } else {
      req[key] = mongoSanitize.sanitize(req[key], options);
    }
  });
  next();
};

app.use(
  sanitizeRequest({
    allowDots: true,
    replaceWith: '_',
  })
);

// الحماية من هجمات الـ XSS
app.use((req, res, next) => {
  if (req.body) req.body = xssClean(req.body);
  if (req.params) req.params = xssClean(req.params);

  if (req.query) {
    // Express 5 قد يجعل req.query getter-only
    const descriptor = Object.getOwnPropertyDescriptor(req, 'query');
    if (!descriptor || descriptor.writable !== false) {
      req.query = xssClean(req.query);
    } else {
      xssClean(req.query);
    }
  }

  next();
});

// تحديد عدد الطلبات (Rate Limiting)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 دقائق
  max: 100, // حد أقصى 100 طلب لكل IP
});
app.use(limiter);

// الحماية من تكرار متغيرات الـ HTTP
app.use(hpp());

// ─── 3. المجلدات العامة (Static Folders) ────────────────────────
// مهم جداً عشان تقدر تفتح روابط الصور في المتصفح
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── 4. المسارات (Routes) ───────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// اختبار عمل السيرفر
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Cars API is running' });
});

// ─── 5. معالجة الأخطاء (Error Handling) ──────────────────────────

// معالجة الروابط غير الموجودة
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'المسار المطلوب غير موجود' });
});

// الـ Middleware العام للأخطاء
app.use(errorHandler);

module.exports = app;
const bahar = 9;