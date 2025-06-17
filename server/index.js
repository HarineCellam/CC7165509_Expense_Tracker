const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

const dataDir = path.join(__dirname,"data");
if(!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

const initializeFile = (fileName, defaultValue = []) => {
    const filePath = path.join(dataDir, fileName);
    if(!fs.existsSync(filePath)){
        fs.writeFileSync(filePath,JSON.stringify(defaultValue));
    }
};

initializeFile('users.json');
initializeFile('transactions.json');
initializeFile('budgets.json');

app.use(cors());
app.use(express.json());

const readData = (fileName) => {
    const filePath = path.join(dataDir,fileName);
    return JSON.parse(fs.readFileSync(filePath));
};

const writeData = (fileName, data) => {
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath,JSON.stringify(data, null, 2));
};

//API Endpoints

// 1. User Authentication Endpoints

app.post('/api/signup', (req,res) => {
    const users = readData('users.json');
    const newUser = req.body;

    // Check if user already exists
    if (users.some(user => user.email === newUser.email)){
        return res.status(400).json({error: 'User already exists'});
    }

    users.push(newUser);
    writeData('users.json',users);
    res.status(201).json({ message : 'User created successfully'});
});

app.post('/api/login', (req,res) => {
    const users = readData('users.json');
    const {email,password} = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if(!user){
        return res.status(401).json({error:'Invalid credentials'});
    }

    res.json({
        message: 'Login successful',
        user: {
            id: user.email,
            name: user.name,
            email: user.email
        }
    });
});

app.post('/api/forgot-password', (req,res) => {
    const {email} = req.body;
    const users = readData('users.json');

    if(!users.some(user=>user.email===email)){
        return res.status(404).json({error:'Email not found'});
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();
    const updatedUsers = users.map(user => {
        if(user.email === email){
            return {...user, resetOTP : otp, otpExpiry : Date.now() + 15*60000};
        }
        return user;
    });

    writeData('users.json',updatedUsers);

    res.json({message:'OTP sent to email',otp});
});

app.post('/api/reset-password', (req,res) => {
    const { email, otp, newPassword } = req.body;
    const users = readData('users.json');

    const user = users.find(u=>u.email===email);
    if(!user || user.resetOTP !== otp || user.otpExpiry < Date.now()){
        return res.status(400).json({error:'Invalid OTP or expired'});
    }

    const updatedUsers = users.map(u=>{
        if(u.email===email){
            return{
                ...u,
                password: newPassword,
                resetOTP: null,
                otpExpiry: null
            };
        }
        return u;
    });

    writeData('users.json', updatedUsers);
    res.json({message:'Password reset successful'});
});

// 2. Transactions Endpoints

app.get('/api/transactions/:userId',(req,res)=>{
    const transactions = readData('transactions.json');
    const userTransactions = transactions.filter(
        t => t.userId === req.params.userId
    );
    res.json(userTransactions);
});

app.post('/api/transactions', (req,res) => {
    const transactions = readData('transactions.json');
    const newTransaction = {
        ...req.body,
        id: Date.now().toString()
    };

    transactions.push(newTransaction);
    writeData('transactions.json',transactions);
    res.status(201).json(newTransaction);
});

app.delete('/api/transactions/:id',(req,res) => {
    const transactions = readData('transactions.json');
    const filtered = transactions.filter(t => t.id !== req.params.id);
    writeData('transactions.json',filtered);
    res.json({ message : 'Transaction deleted' });
});

// 3. Budgets Endpoints

app.get('/api/budgets/:userId',(req,res) => {
    const budgets = readData('budgets.json');
    const userBudgets = budgets.filter(
        b => b.userId === req.params.userId
    );
    res.json(userBudgets);
});

app.post('/api/budgets', (req,res) => {
    const budgets = readData('budgets.json');
    const newBudget = {
        ...req.body,
        id: Date.now().toString()
    };

    const existingIndex = budgets.findIndex(b=>b.id===newBudget.id);
    if (existingIndex !== -1){
        budgets[existingIndex] = newBudget;
    }
    else{
        budgets.push(newBudget);
    }
    writeData('budgets.json', budgets);
    res.status(201).json(newBudget);
});

app.delete('/api/budgets/:id',(req,res)=>{
    const budgets = readData('budgets.json');
    const filtered = budgets.filter(b=>b.id!==req.params.id);
    writeData('budgets.json',filtered);
    res.json({ message : 'Budget deleted'});
});

// 4. User Profile Endpoint

app.get('/api/profile/:email',(req,res) => {
    const users = readData('users.json');
    const user = users.find(u=> u.email === req.params.email);

    if(!user){
        return res.status(404).json({error:'User not found'});
    }

    const { password, ...safeUser} = user;
    res.json(safeUser);
});

app.put('/api/profile/:email',(req,res) => {
    const users = readData('users.json');
    const updatedUser = req.body;

    const updatedUsers = users.map(user => {
        if(user.email === req.params.email){
            return{...user, ...updatedUser};
        }
        return user;
    });

    writeData('users.json', updatedUsers);
    res.json({ message : 'Profile updated'});
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});