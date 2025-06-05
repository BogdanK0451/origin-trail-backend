const axios = require('axios');

module.exports = async function fetchBalance(address, date) {
  try {
    if (!address || !date) throw new Error('Input missing');
    const timestamp = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);

    const blockRes = await axios.get(process.env.ETHERSCAN_API_URL, {
      params: {
        chainid:1,
        module: 'block',
        action: 'getblocknobytime',
        timestamp,
        closest: 'before',
        apikey: process.env.ETHERSCAN_API_KEY,
      },
    });

  if (blockRes.data.status !== '1') throw new Error(blockRes.data.message);
    const blockNumber = blockRes.data.result;
    const blockHex = '0x' + parseInt(blockNumber, 10).toString(16);

    // Replaced eth_getBalance call, with infura rpc because
    // the docs on etherscan API said that you can call any method from ethereum json-rpc using proxy module...and i swear eth_getBalance action worked for a while...
    // but then it started giving me errors..so i had to resort to this
    const balanceRes = await axios.post(
      `${process.env.INFURA_API_URL}/${process.env.INFURA_API_KEY}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, blockHex],
      }
    );

    // const balanceRes = await axios.get(process.env.ETHERSCAN_API_URL, {
    //   params: {
    //     chainid:1,
    //     module: 'proxy',
    //     action: 'eth_getBalance',
    //     address,
    //     tag: 'latest',
    //     apikey: process.env.ETHERSCAN_API_KEY,
    //   },
    // });


    if (balanceRes.data.error) throw new Error(balanceRes.data.error.message);
    const balance = parseInt(balanceRes.data.result, 16) / 1e18;

    return { balance: balance.toFixed(6) };
  } catch (err) {
    console.error('fetchBalance error:', err);
    throw err;
  }
};
