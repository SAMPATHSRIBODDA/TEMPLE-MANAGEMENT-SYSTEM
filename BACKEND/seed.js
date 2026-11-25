require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./src/models/Role');
const Temple = require('./src/models/Temple');
const Counter = require('./src/models/Counter');
const Ticket = require('./src/models/Ticket');
const LadduOrder = require('./src/models/LadduOrder');
const LadduProduct = require('./src/models/LadduProduct');
const Receipt = require('./src/models/Receipt');
const Payment = require('./src/models/Payment');
const Donation = require('./src/models/Donation');
const User = require('./src/models/User');

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // ── Clean existing data ──────────────────────────────────────
    await Promise.all([
      Role.deleteMany(), Temple.deleteMany(), Counter.deleteMany(),
      Ticket.deleteMany(), LadduOrder.deleteMany(), LadduProduct.deleteMany(),
      Receipt.deleteMany(), Payment.deleteMany(), Donation.deleteMany(), User.deleteMany()
    ]);
    console.log('Cleared existing data.');

    // ── 1. Roles ─────────────────────────────────────────────────
    const roles = await Role.insertMany([
      { name: 'Super Admin', description: 'Full system access' },
      { name: 'Temple Admin', description: 'Manages a specific temple' },
      { name: 'Counter Staff', description: 'Handles counter sales' },
      { name: 'Accountant', description: 'Financial access only' },
    ]);
    console.log('Roles seeded.');

    // ── 2. Temple ─────────────────────────────────────────────────
    const temple = await Temple.create({
      name: 'Sri Venkateswara Swamy Temple',
      address: { city: 'Tirupati', state: 'Andhra Pradesh', country: 'India' },
      timings: { openingTime: '04:00 AM', closingTime: '10:00 PM' }
    });
    console.log('Temple seeded:', temple._id);

    // ── 3. Counters ───────────────────────────────────────────────
    await Counter.insertMany([
      { _id: 'receiptId', seq: 1000 },
      { _id: 'ticketId', seq: 1000 }
    ]);
    console.log('Counters seeded.');

    // ── 4. Users ──────────────────────────────────────────────────
    const adminUser = await User.create({
      firstName: 'Temple',
      lastName: 'Admin',
      email: 'admin@temple.com',
      phone: '9000000001',
      password: '$2a$10$xJXQVi5MqQQHUj1mvqMxi.5i8TN0yGlcC7Q1B/KzGP4kFmHo2YDfG',
      templeId: temple._id,
      role: roles[1]._id
    });
    const counterUser = await User.create({
      firstName: 'Counter',
      lastName: 'Staff1',
      email: 'counter1@temple.com',
      phone: '9000000002',
      password: '$2a$10$xJXQVi5MqQQHUj1mvqMxi.5i8TN0yGlcC7Q1B/KzGP4kFmHo2YDfG',
      templeId: temple._id,
      role: roles[2]._id
    });
    console.log('Users seeded.');

    // ── 5. Laddu Products ─────────────────────────────────────────
    const ladduProducts = await LadduProduct.insertMany([
      { templeId: temple._id, name: 'Big Laddu (Kalyanam)', price: 200, stock: 500 },
      { templeId: temple._id, name: 'Small Laddu (Regular)', price: 50, stock: 2500 },
      { templeId: temple._id, name: 'Vada Prasadam', price: 100, stock: 200 },
    ]);
    console.log('Laddu products seeded.');

    // ── 6. Generate 30 days of historical transactions ────────────
    const TICKET_TYPES = ['Entry', 'Darshan - General', 'Darshan - Special', 'Darshan - VIP'];
    const PRICES = { 'Entry': 50, 'Darshan - General': 100, 'Darshan - Special': 300, 'Darshan - VIP': 500 };
    const PAYMENT_METHODS = ['Cash', 'UPI', 'Card'];
    const DONATION_CATEGORIES = ['General Donation', 'Annadanam', 'Temple Development', 'Festival Contribution'];

    console.log('Seeding 30 days of transaction history...');
    
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(6, 0, 0, 0);

      const txCount = randomBetween(50, 200); // transactions per day

      for (let i = 0; i < txCount; i++) {
        const txTime = new Date(date);
        txTime.setHours(txTime.getHours() + randomBetween(0, 16));
        txTime.setMinutes(randomBetween(0, 59));

        const ticketType = TICKET_TYPES[randomBetween(0, 3)];
        const price = PRICES[ticketType];
        const adults = randomBetween(1, 5);
        const paymentMethod = PAYMENT_METHODS[randomBetween(0, 2)];
        const total = price * adults;

        // Create ticket
        const ticket = await Ticket.create({
          templeId: temple._id,
          ticketNumber: `TKT-${Date.now()}-${i}`,
          ticketType,
          price,
          adultCount: adults,
          validForDate: txTime,
          qrCode: `QR-${Math.random().toString(36).substr(2, 9)}`,
          issuedBy: counterUser._id,
          status: 'issued',
          createdAt: txTime,
          updatedAt: txTime
        });

        // Create receipt
        const receipt = await Receipt.create({
          templeId: temple._id,
          receiptNumber: `RCT-${Date.now()}-${i}`,
          issuedBy: counterUser._id,
          totalAmount: total,
          paymentMethod,
          items: [{ itemType: 'Ticket', referenceId: ticket._id, price, quantity: adults }],
          createdAt: txTime,
          updatedAt: txTime
        });

        // Create payment
        await Payment.create({
          templeId: temple._id,
          receiptId: receipt._id,
          amount: total,
          method: paymentMethod,
          status: 'captured',
          createdAt: txTime,
          updatedAt: txTime
        });

        // Occasional Laddu sale
        if (randomBetween(0, 4) === 0) {
          const laddu = ladduProducts[randomBetween(0, 2)];
          const qty = randomBetween(1, 5);
          await LadduOrder.create({
            templeId: temple._id,
            productId: laddu._id,
            quantity: qty,
            totalPrice: laddu.price * qty,
            orderType: 'Counter',
            status: 'collected',
            issuedBy: counterUser._id,
            createdAt: txTime,
            updatedAt: txTime
          });
        }

        // Occasional donation
        if (randomBetween(0, 9) === 0) {
          await Donation.create({
            templeId: temple._id,
            donorName: ['Ravi Shankar', 'Anita Devi', 'Suresh Kumar', 'Lakshmi Bai', 'Ganesh Rao'][randomBetween(0, 4)],
            amount: [100, 251, 500, 1001, 1100, 5001][randomBetween(0, 5)],
            donationCategory: DONATION_CATEGORIES[randomBetween(0, 3)],
            paymentMethod,
            receiptIssued: true,
            createdAt: txTime,
            updatedAt: txTime
          });
        }
      }
      console.log(`  Day -${dayOffset}: ${txCount} transactions created.`);
    }

    console.log('\n✅ Seeding complete! Database is ready for demonstration.');
    console.log(`   Temple: ${temple.name} (ID: ${temple._id})`);
    console.log(`   Admin login: admin@temple.com / password123`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDB();
