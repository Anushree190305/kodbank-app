const express = require('express');
const router = express.Router();
const {
  deposit,
  withdraw,
  transfer,
  getTransactions,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/transactions', getTransactions);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
