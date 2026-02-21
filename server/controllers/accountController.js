const User = require('../models/User');
const Transaction = require('../models/Transaction');

const deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive amount' });
    }

    const amountNum = parseFloat(amount);
    const user = await User.findById(req.user.id);

    user.balance += amountNum;
    user.totalDeposited += amountNum;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'deposit',
      amount: amountNum,
      status: 'completed',
    });

    res.json({
      message: 'Deposit successful',
      balance: user.balance,
      totalDeposited: user.totalDeposited,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive amount' });
    }

    const amountNum = parseFloat(amount);
    const user = await User.findById(req.user.id);

    if (user.balance < amountNum) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amountNum;
    user.totalWithdrawn += amountNum;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'withdraw',
      amount: amountNum,
      status: 'completed',
    });

    res.json({
      message: 'Withdrawal successful',
      balance: user.balance,
      totalWithdrawn: user.totalWithdrawn,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const transfer = async (req, res) => {
  try {
    const { recipientEmailOrAccount, amount } = req.body;

    if (!recipientEmailOrAccount || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Please provide recipient and valid amount' });
    }

    const amountNum = parseFloat(amount);
    const sender = await User.findById(req.user.id);

    if (sender.balance < amountNum) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const recipient = await User.findOne({
      $or: [
        { email: recipientEmailOrAccount.toLowerCase() },
        { accountNumber: recipientEmailOrAccount },
      ],
    });

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (recipient._id.toString() === sender._id.toString()) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    sender.balance -= amountNum;
    sender.totalWithdrawn += amountNum;
    await sender.save();

    recipient.balance += amountNum;
    recipient.totalDeposited += amountNum;
    await recipient.save();

    await Transaction.create({
      userId: sender._id,
      type: 'transfer',
      amount: amountNum,
      recipient: recipient.email,
      recipientAccountNumber: recipient.accountNumber,
      status: 'completed',
    });

    await Transaction.create({
      userId: recipient._id,
      type: 'transfer',
      amount: amountNum,
      recipient: sender.email,
      recipientAccountNumber: sender.accountNumber,
      status: 'completed',
    });

    res.json({
      message: 'Transfer successful',
      balance: sender.balance,
      totalWithdrawn: sender.totalWithdrawn,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .lean();

    const formatted = transactions.map((t) => ({
      id: t._id,
      type: t.type,
      amount: t.amount,
      recipient: t.recipient || t.recipientAccountNumber,
      status: t.status,
      date: t.date,
    }));

    res.json({ transactions: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        accountNumber: user.accountNumber,
        balance: user.balance,
        totalDeposited: user.totalDeposited,
        totalWithdrawn: user.totalWithdrawn,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        accountNumber: user.accountNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  deposit,
  withdraw,
  transfer,
  getTransactions,
  getProfile,
  updateProfile,
  changePassword,
};
