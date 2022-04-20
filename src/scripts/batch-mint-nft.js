require('dotenv').config();
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
// const ALCHEMY_ARBITRUM_API_URL = process.env.ALCHEMY_ARBITRUM_API_URL;
const ALCHEMY_POLYGON_API_URL = process.env.ALCHEMY_POLYGON_API_URL;
// const BILLYBLOCK_CONTRACT_ADDRESS = process.env.BILLYBLOCK_CONTRACT_ADDRESS;
// const BILLYBLOCK_ARBITRUM_CONTRACT_ADDRESS = process.env.BILLYBLOCK_ARBITRUM_CONTRACT_ADDRESS;
const BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS = process.env.BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS;
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
// const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET_KEY = process.env.PINATA_API_SECRET_KEY;


// Setup our web3 provider connection (using Alchemy)
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_POLYGON_API_URL);

const contract = require("../artifacts/contracts/BillyBlock.sol/BillyBlock.json");
const nftContract = new web3.eth.Contract(contract.abi, BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS);

//call to pinata w our key
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET_KEY);

// var tokenId = nftContract.methods.lastTokenId().call().then(function(response) {
//     console.log(response);
// });

/***
    This is where the main action will happen
***/
async function main() {

    //create a hash file for every json upload
    // const fs = require('fs');

    // pinDefaultJSONToPinata().then((result) => {
    //     //handle results here
    //     console.log("Pinned file; Hash: " + result['IpfsHash']);
    //     console.log(createDefaultIpfsList(result['IpfsHash']));
    //     // Don't use until we have our uri set up proper
    //     // batchMintNFT(createDefaultIpfsList(result['IpfsHash']));
    // }).catch((err) => {
    //     //handle error here
    //     console.error(err);
    // });

    batchMintNFT(
        "https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz",
        "8A2BE2",
        10
    );
}
main();

// function pinDefaultJSONToPinata() {
//     const readableStreamForFile = fs.createReadStream('default-nft-metadata.json');
//     const fileName = "BB_Metadata.json";
//     const options = {
//         pinataMetadata: {
//             name: fileName
//         },
//         pinataOptions: {
//             cidVersion: 0
//         }
//     };
//     return pinata.pinFileToIPFS(readableStreamForFile, options);
// }
//
// const BASE_PINATA_DIR = "https://gateway.pinata.cloud/ipfs/";
// const MINT_AMOUNT = 5;
// function createDefaultIpfsList(hash) {
//     const url = BASE_PINATA_DIR + hash;
//     var returnList = [];
//     for(var i = 0; i < MINT_AMOUNT; i++) {
//         returnList.push(url);
//     }
//     return returnList;
// }

/*
    This was for testing the ERC721 contract batch minting
*/
//'gas': 5000000,
//'maxPriorityFeePerGas': 1999999987,

async function batchMintNFT(uri, colorHex, amount) {
    const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest'); //get latest nonce
    //the transaction
    const tx = {
        'from': METAMASK_PUBLIC_KEY,
        'to': BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS,
        'nonce': nonce,
        'gas': 5000000,
        // 'data': nftContract.methods.getMapSize()
        'data': nftContract.methods.batchMintNFT(METAMASK_PUBLIC_KEY, uri, colorHex, amount).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, METAMASK_PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}
