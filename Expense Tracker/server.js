const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 3019
const bcrypt = require('bcrypt');  
const session = require('express-session');

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))
app.use(express.json()); // Add JSON parsing

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

mongoose.connect('mongodb://127.0.0.1:27017/expensetracker',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection
db.once('open',()=>{
    console.log("Mongo Database Connection Successfull")
})

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    budget: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);
const Transactions = mongoose.model('Transactions', transactionSchema);

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Please log in first' });
    }
}

// Routes
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'signup.html')) 
})

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/signin');
    }
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body;
    console.log("Form Data:", req.body); 

    try {
        // Normalize email before saving (same as signin)
        const normalizedEmail = email.trim().toLowerCase();
        
        // Check if user already exists
        const existingUser = await Users.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).send('User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = new Users ({
            name,
            email: normalizedEmail, // Save normalized email
            password: hashedPassword,
        });

        await user.save()
        console.log(user)
        
        // Set session
        req.session.userId = user._id;
        req.session.userName = user.name;
        
        // Redirect to dashboard instead of sending text
        res.redirect('/dashboard');
        
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).send('Error saving user');
    }
});

// Sign in Part
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname,'signin.html'));
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  
  console.log("Full request body:", req.body); // Debug log
  console.log("Email received:", email); // Debug log
  console.log("Password received:", password ? "Present" : "Missing"); // Debug log

  // Check if email and password are provided
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).send('Email and password are required');
  }

  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Normalized email:", normalizedEmail); // Debug log
    
    // Find user
    const user = await Users.findOne({ email: normalizedEmail });
    console.log("User found:", user ? "Yes" : "No"); // Debug log
    
    if (!user) {
      console.log("User not found in database");
      return res.status(404).send('User not found');
    }

    // Compare passwords
    console.log("Comparing passwords..."); // Debug log
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debug log
    
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).send('Invalid password');
    }

    // Success - set session and redirect to dashboard
    req.session.userId = user._id;
    req.session.userName = user.name;
    console.log("Login successful for:", user.name);
    res.redirect('/dashboard');
    
  } catch (err) {
    console.error("Signin error details:", err);
    res.status(500).send(`Login error: ${err.message}`);
  }
});

// API Routes for transactions

// Get user info and budget
app.get('/api/user', requireLogin, async (req, res) => {
    try {
        const user = await Users.findById(req.session.userId);
        res.json({
            name: user.name,
            budget: user.budget || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Get all transactions for logged-in user
app.get('/api/transactions', requireLogin, async (req, res) => {
    try {
        const transactions = await Transactions.find({ userId: req.session.userId })
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

// Add new transaction
app.post('/api/transactions', requireLogin, async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;
        
        const transaction = new Transactions({
            userId: req.session.userId,
            description,
            amount: parseFloat(amount),
            type,
            category,
            date
        });
        
        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding transaction' });
    }
});

// Delete transaction
app.delete('/api/transactions/:id', requireLogin, async (req, res) => {
    try {
        const transaction = await Transactions.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId // Ensure user can only delete their own transactions
        });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

// Set/Update budget
app.post('/api/budget', requireLogin, async (req, res) => {
    try {
        const { budget } = req.body;
        
        await Users.findByIdAndUpdate(req.session.userId, {
            budget: parseFloat(budget)
        });
        
        res.json({ message: 'Budget updated successfully', budget: parseFloat(budget) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating budget' });
    }
});

// Get budget
app.get('/api/budget', requireLogin, async (req, res) => {
    try {
        const user = await Users.findById(req.session.userId);
        res.json({ budget: user.budget || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching budget' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Logout route (GET)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/signin');
    });
});

app.listen(port,()=>{
    console.log("Server Started")
})