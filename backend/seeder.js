

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import constants from './utils/constants.js';

const { ROLES, USER_STATUS } = constants;

// Admin user configuration
const ADMIN_USER = {
  name: process.env.ADMIN_NAME || 'System Admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'Admin123!',
  role: ROLES.ADMIN,
  status: USER_STATUS.ACTIVE,
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });

    if (existingAdmin) {
      console.log(`Admin user with email '${ADMIN_USER.email}' already exists.`);
      console.log('Skipping admin creation.');
      return;
    }

    // Create admin user
    const admin = await User.create(ADMIN_USER);

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role:  ${admin.role}`);
    console.log(`  ID:    ${admin._id}`);
    console.log(`\nYou can now login with:`);
    console.log(`  Email:    ${ADMIN_USER.email}`);
    console.log(`  Password: ${ADMIN_USER.password}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');

  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await seedAdmin();

    // Disconnect from database
    await mongoose.connection.close();
    console.log('Database connection closed.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeder
main();
