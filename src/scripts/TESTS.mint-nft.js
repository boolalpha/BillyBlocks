require('dotenv').config();
const REACT_APP_ALCHEMY_API_URL = process.env.REACT_APP_ALCHEMY_API_URL;
const CONTRACT_ADDRESS = process.env.NEWEST_CONTRACT_ADDRESS
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
const REACT_APP_METAMASK_PRIVATE_KEY = process.env.REACT_APP_METAMASK_PRIVATE_KEY;
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;

// import { OpenSeaPort, Network } from 'opensea-js';

// Setup our web3 provider connection (using Alchemy)
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(REACT_APP_ALCHEMY_API_URL);

// Setup our connection to OpenSea for selling listing
// const seaport = new OpenSeaPort(web3, {
//   networkName: Network.Main,
//   apiKey: OPENSEA_API_KEY
// });


const contract = require("../artifacts/contracts/BillyBlock.sol/BillyBlock.json");
// console.log(JSON.stringify(contract.abi));

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);


/*
    This was for testing the ERC721 contract
*/
// async function mintNFT(tokenURI) {
//     const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest'); //get latest nonce
//     //the transaction
//     const tx = {
//         'from': METAMASK_PUBLIC_KEY,
//         'to': CONTRACT_ADDRESS,
//         'nonce': nonce,
//         'gas': 500000,
//         'maxPriorityFeePerGas': 1999999987,
//         'data': nftContract.methods.mintNFT(METAMASK_PUBLIC_KEY, tokenURI).encodeABI()
//     };
//
//     const signedTx = await web3.eth.accounts.signTransaction(tx, REACT_APP_METAMASK_PRIVATE_KEY);
//     const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//
//     console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
// }

/*
    This was for testing the ERC721 contract batch minting
*/
// async function batchMintNFT(amount) {
//     const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest'); //get latest nonce
//     //the transaction
//     const tx = {
//         'from': METAMASK_PUBLIC_KEY,
//         'to': CONTRACT_ADDRESS,
//         'nonce': nonce,
//         'gas': 500000,
//         'maxPriorityFeePerGas': 1999999987,
//         'data': nftContract.methods.batchMintNFT(METAMASK_PUBLIC_KEY, amount).encodeABI()
//     };
//
//     const signedTx = await web3.eth.accounts.signTransaction(tx, REACT_APP_METAMASK_PRIVATE_KEY);
//     const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//
//     console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
// }
//
// batchMintNFT(5)


/*
    This was for testing the ERC1155 contract
*/
// async function batchMintNFT() {
//     const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest'); //get latest nonce
//     //the transaction
//     const tx = {
//         'from': METAMASK_PUBLIC_KEY,
//         'to': CONTRACT_ADDRESS,
//         'nonce': nonce,
//         'gas': 500000,
//         'maxPriorityFeePerGas': 1999999987,
//         'data': nftContract.methods.batchMintNFT(METAMASK_PUBLIC_KEY, [1,2,3,4,5], [1,1,1,1,1]).encodeABI()
//     };
//
//     const signedTx = await web3.eth.accounts.signTransaction(tx, REACT_APP_METAMASK_PRIVATE_KEY);
//     const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//
//     console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
// }
//
// batchMintNFT();
