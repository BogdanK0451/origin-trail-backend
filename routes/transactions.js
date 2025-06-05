const express = require('express')
const router = express.Router()
const fetchTransactions = require('../controllers/transactions')

router.get('/:address/:startBlock', async (req, res, next) => {
  try {
    const { address, startBlock } = req.params
    const { page, itemsPerPage } = req.query
    if (!page || !itemsPerPage) {
      return res.status(400).json({ error: 'Missing page or itemsPerPage' })
    }
    const transactions = await fetchTransactions(address, startBlock, parseInt(page), parseInt(itemsPerPage))
    res.json(transactions)
  } catch (error) {
    next(error)
  }
})

module.exports = router