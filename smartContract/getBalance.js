const Web3 = require('web3');
const web3 = new Web3('https://rpc.sepolia.org');
const abi =require ('./ABI.json');
const contract = new web3.eth.Contract(abi,  )  //address of the contract as the 2nd params

const getBalance = async () => {
    const balance = await contract.methods.balance.call().call()
    console.log('Balance is: ' + balance)
}

getBalance()

//to see the balance 'node getBalance'