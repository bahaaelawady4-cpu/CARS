const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');
const Category = require('./models/Category');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🗑️  Clearing existing cars...');
    await Car.deleteMany({});

    // Create or get categories
    console.log('📁 Creating categories...');
    
    let hypercarCategory = await Category.findOne({ name: 'Hypercar' });
    if (!hypercarCategory) {
      hypercarCategory = await Category.create({
        name: 'Hypercar',
        description: 'Top-tier extreme performance vehicles'
      });
    }

    let luxuryCategory = await Category.findOne({ name: 'Luxury' });
    if (!luxuryCategory) {
      luxuryCategory = await Category.create({
        name: 'Luxury',
        description: 'High-end luxury vehicles'
      });
    }

    let sedanCategory = await Category.findOne({ name: 'Sedan' });
    if (!sedanCategory) {
      sedanCategory = await Category.create({
        name: 'Sedan',
        description: 'Comfortable sedan vehicles'
      });
    }

    // Sample cars data with real external image URLs (unique photos)
    const carsData = [
      {
        name: 'Pagani Zonda HP Barchetta',
        brand: 'Pagani',
        price: 17500000,
        year: 2018,
        description: 'Ultra-rare hypercar featuring an open top, extreme performance, and a unique, striking design.',
        category: hypercarCategory._id,
        image: ['/uploads/pagani-zonda-hp-barchetta-1.jpg']
      },
      {
        name: 'Mitsubishi Lancer',
        brand: 'Mitsubishi',
        price: 5000,
        year: 2008,
        description: 'Reliable classic commuter sedan with a practical and highly durable design.',
        category: sedanCategory._id,
        image: ['/uploads/item407270.jpg']
      },
      {
        name: 'Koenigsegg CC8S',
        brand: 'Koenigsegg',
        price: 1200000,
        year: 2002,
        description: 'Swedish hypercar legend with massive power and pure performance design.',
        category: hypercarCategory._id,
        image: ['/uploads/2015-03-03_Geneva_Motor_Show_3305.jpeg']
      },
      {
        name: 'Bugatti Divo Concept',
        brand: 'Bugatti',
        price: 3200000,
        year: 2024,
        description: 'Limited-run hypercar concept with extreme aerodynamics and legendary W16 power.',
        category: hypercarCategory._id,
        image: ['/uploads/images.jpeg'] 
      },
      {
        name: 'Aston Martin DB12',
        brand: 'Aston Martin',
        price: 500000,
        year: 2024,
        description: 'Luxury GT with elegant lines, advanced tech and sumptuous cabin.',
        category: luxuryCategory._id,
        image: ['/uploads/image-1774699936946-462465433.png']
      }
    ];

    // Insert cars
    console.log('🚗 Adding cars...');
    const insertedCars = await Car.insertMany(carsData);

    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Created ${insertedCars.length} cars`);
    console.log('📊 Created 3 categories');

    // Display created cars
    console.log('\n📋 Created Cars:');
    insertedCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.name} (${car.brand}) - $${car.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(' Seeding Error:', error);
    process.exit(1);
  }
};

// Run seeding
(async () => {
  await connectDB();
  await seedDatabase();
})();
