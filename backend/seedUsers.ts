import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});
const User = mongoose.model('User', userSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventdb');

  // Hash passwords
  const userPassword = await bcrypt.hash('userpass', 10);
  const adminPassword = await bcrypt.hash('adminpass', 10);

  // Create user and admin
  await User.create([
    { username: 'user', password: userPassword, role: 'user' },
    { username: 'admin', password: adminPassword, role: 'admin' },
  ]);

  console.log('User and admin created!');
  await mongoose.disconnect();
}

seed().catch(console.error);