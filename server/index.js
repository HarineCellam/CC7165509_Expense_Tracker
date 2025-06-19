// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const budgetRoutes = require('./routes/budgets');
// const transactionRoutes = require('./routes/transactions');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // API Endpoints

// // 1. User Authentication Endpoints

// app.post('/api/signup', async (req, res) => {
//   try {
//     const newUser = req.body;
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ email: newUser.email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const user = await User.create(newUser);
//     res.status(201).json({ 
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email, password });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json({
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: 'Email not found' });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOTP = otp;
//     user.otpExpiry = Date.now() + 15 * 60000;
//     await user.save();

//     res.json({ message: 'OTP sent to email', otp });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/reset-password', async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || user.resetOTP !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ error: 'Invalid OTP or expired' });
//     }

//     user.password = newPassword;
//     user.resetOTP = null;
//     user.otpExpiry = null;
//     await user.save();

//     res.json({ message: 'Password reset successful' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 2. Transactions Endpoints

// app.get('/api/transactions/:userId', async (req, res) => {
//   try {
//     const transactions = await Transaction.find({ userId: req.params.userId });
//     res.json(transactions);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/transactions', async (req, res) => {
//   try {
//     const newTransaction = await Transaction.create(req.body);
//     res.status(201).json(newTransaction);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.delete('/api/transactions/:id', async (req, res) => {
//   try {
//     await Transaction.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Transaction deleted' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 3. Budgets Endpoints

// app.get('/api/budgets/:userId', async (req, res) => {
//   try {
//     const budgets = await Budget.find({ userId: req.params.userId });
//     res.json(budgets);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/budgets', async (req, res) => {
//   try {
//     const { userId, category } = req.body;
    
//     // Check if budget already exists for this user and category
//     let budget = await Budget.findOne({ userId, category });
    
//     if (budget) {
//       // Update existing budget
//       budget.limit = req.body.limit;
//       budget.period = req.body.period || budget.period;
//       await budget.save();
//     } else {
//       // Create new budget
//       budget = await Budget.create(req.body);
//     }
    
//     res.status(201).json(budget);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.delete('/api/budgets/:id', async (req, res) => {
//   try {
//     await Budget.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Budget deleted' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 4. User Profile Endpoint

// app.get('/api/profile/:email', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const { password, resetOTP, otpExpiry, ...safeUser } = user.toObject();
//     res.json(safeUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.put('/api/profile/:email', async (req, res) => {
//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { email: req.params.email },
//       req.body,
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const { password, resetOTP, otpExpiry, ...safeUser } = updatedUser.toObject();
//     res.json({ message: 'Profile updated', user: safeUser });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/budgets', budgetRoutes);
// app.use('/api/transactions', transactionRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});