const Web3 = require('web3');
const web3 = new Web3('https://rpc.sepolia.org');
const abi =require ('./ABI.json');
const fromAddress = '0xCC20dD1f89862B6A4AeC224a2F4bF57C8F20BaA5'
const toAddress = ''
const privatekey= 'caaa983a709ea38172ba53741e16db8bee4be4711dea132bbe7b6ba51c0fa10e'


const sendMoney = async () => {
    const sendTransaction = await web3.eth.accounts.signTransaction(

        {
            to: toAddress,
            value: web3.utils.toWei("0.0123126", "ethr"),
            gas: await web3.eth.estimateGas(),
            gasPrice: await web3.eth.getGasPrice(),
            nonce: await web3.eth.getTransactionCount(fromAddress),
            
        },
       privatekey
    );

    web3.eth.sendSignedTransaction(sendTransaction.rawTransaction)
};

sendMoney()