const express = require('express');
const router = express.Router();
const fetchBalance = require('../controllers/balance');

router.get('/:address/:date', async (req, res, next) => {
  try {
    const { address, date } = req.params;
    if (!address || !date) {
      return res.status(400).json({ error: 'Missing address or date' });
    }
    const balance = await fetchBalance(address, date);
    res.json(balance);
  } catch (error) {
    next(error);
  }
});

module.exports = router;