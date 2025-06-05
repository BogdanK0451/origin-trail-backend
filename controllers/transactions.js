const axios = require('axios')

module.exports = async function fetchTransactions(address, startBlock, page, itemsPerPage) {
  try {
    if (!address || !startBlock || !page || !itemsPerPage) throw new Error('Input missing')
    console.log(process.env.ETHERSCAN_API_URL)
    const response = await axios.get(process.env.ETHERSCAN_API_URL, {
      params: {
        chainid: 1,
        module: 'account',
        action: 'txlist',
        address,
        startblock: startBlock,
        endblock: 'latest',
        sort: 'asc',
        apikey: process.env.ETHERSCAN_API_KEY,
        page,
        offset: itemsPerPage,
      },
    })

    if (response.data.status !== '1') throw new Error(response.data.message)

    return response.data.result.map(tx => ({
      from: tx.from,
      to: tx.to,
      value: (parseInt(tx.value) / 1e18).toFixed(6),
      blockNumber: tx.blockNumber,
      hash: tx.hash,
      timeStamp: tx.timeStamp,
    }))
  } catch (err) {
    console.error('fetchTransactions error:', err)
    throw err
  }
}
