// require('dotenv').config();
// const REACT_APP_ALCHEMY_API_URL = process.env.REACT_APP_ALCHEMY_API_URL;
// const REACT_APP_ALCHEMY_POLYGON_API_URL = process.env.REACT_APP_ALCHEMY_POLYGON_API_URL;
const REACT_APP_ALCHEMY_MUMBAI_API_URL = process.env.REACT_APP_ALCHEMY_MUMBAI_API_URL;
// const REACT_APP_BILLYBLOCK_CONTRACT_ADDRESS = process.env.REACT_APP_BILLYBLOCK_CONTRACT_ADDRESS;
const REACT_APP_BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS = process.env.REACT_APP_BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS;

const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const REACT_APP_PINATA_API_SECRET_KEY = process.env.REACT_APP_PINATA_API_SECRET_KEY;

//call to pinata w our key
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(REACT_APP_PINATA_API_KEY, REACT_APP_PINATA_API_SECRET_KEY);

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(REACT_APP_ALCHEMY_MUMBAI_API_URL);

const contract = require("../artifacts/contracts/BillyBlocks.sol/BillyBlocks.json");

export const billyBlockContract = new web3.eth.Contract(contract.abi, REACT_APP_BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS);

export const loadCurrentAmountMinted = async () => {
    const amount = await billyBlockContract.methods.lastTokenId().call();
    return amount - 1; //subtract one because it will be one ahead of the amount created
};

export const loadCurrentPixelMap = async () => {
    const pixelMap = await billyBlockContract.methods.getAllPixels().call();

    //build the desired pixelMap architecture
    var pixelMapFinal = {};
    var size = pixelMap[0].length;  //we could use any of the returned arrays b/c solidity should guarantee equal sizes
    for(var i = 0; i < size; i++) {
        var pixel = {
            'id': pixelMap[0][i],
            'colorHex': pixelMap[2][i],
            'ipfsHttp': pixelMap[3][i]
        };

        var owner = pixelMap[1][i];

        //this groups our owners
        if(owner in pixelMapFinal) {
            pixelMapFinal[owner].push(pixel);
        } else {
            pixelMapFinal[owner] = [pixel];
        }
    }

    //this creates an array of objects that will be returned
    var pixelMapArray = [];
    for (let [key, value] of Object.entries(pixelMapFinal)) {
        pixelMapArray.push({"owner": key, "pixels": value});
    }

    //need to sort the array of objects
    pixelMapArray.sort((a, b) => {
        return ((a["pixels"].length - b["pixels"].length) * (-1));  //this returns a before b if positive so we multiply by -1 to get descending
    });

    // return pixelMapFinal;
    return pixelMapArray;
};

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
};

export const sendTransfer = async (userWalletAddress, transferToAddress, idArray) => {
    //input error handling
    if (!window.ethereum || userWalletAddress === null) {
        console.error("Not connected to Wallet");
        return {
            result:
            "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    // set up transaction parameters
    const transactionParameters = {
        to: REACT_APP_BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS, // Required except during contract publications.
        from: userWalletAddress, // must match user's active address.
        data: billyBlockContract.methods.batchTransfer(userWalletAddress, transferToAddress, idArray).encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });

        return {
            result: (
                '<div>Successfully made transfer! Please return to the Home page to view the ownership change onchain. View your transaction on <a href="https://polygonscan.com/tx/${txHash}">PolygonScan</a></div>'
            )
        };
    } catch (error) {
        return {
            result: "😥 " + error.message,
        };
    }
}

export const pinJSONToPinata = async (colorHexList) => {
    var ipfsList = [];

    for(var i = 0; i < colorHexList.length; i++) {
        //build body of json
        const body = {
            "image": "https://gateway.pinata.cloud/ipfs/QmTkWMMUvmwvuo5iTnHu23uvernvdSVUfcgzsiU3MrWmSm",
            "background_color": colorHexList[i]
        };
        const options = {
            pinataMetadata: {
                name: "BillyBlockMetadata"
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        await pinata.pinJSONToIPFS(body, options).then((result) => {
            //handle results here
            // console.log(result);
            ipfsList.push("https://gateway.pinata.cloud/ipfs/" + result["IpfsHash"])
        }).catch((err) => {
            //handle error here
            console.error(err);
            return err;
        });
    }

    return await ipfsList;
}



export const sendEdit = async (userWalletAddress, listOfIds, listOfHexStrings, listOfNewIpfs) => {
    //input error handling
    if (!window.ethereum || userWalletAddress === null) {
        console.error("Not connected to Wallet");
        return {
            result:
            "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    // set up transaction parameters
    const transactionParameters = {
        to: REACT_APP_BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS, // Required except during contract publications.
        from: userWalletAddress, // must match user's active address.
        data: billyBlockContract.methods.batchEditMetadata(listOfIds, listOfHexStrings, listOfNewIpfs).encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });

        return {
            result: (
                '<div>Successfully edited colors! Please return to the Home page to view the color change onchain. View your transaction on <a href="https://polygonscan.com/tx/${txHash}">PolygonScan</a></div>'
            )
        };
    } catch (error) {
        return {
            result: "😥 " + error.message,
        };
    }

}

export const sendMint = async (userWalletAddress, ipfs, colorHex, amount) => {
    //input error handling
    if (!window.ethereum || userWalletAddress === null) {
        console.error("Not connected to Wallet");
        return {
            result:
            "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    // set up transaction parameters
    const transactionParameters = {
        to: REACT_APP_BILLYBLOCK_MUMBAI_CONTRACT_ADDRESS, // Required except during contract publications.
        from: userWalletAddress, // must match user's active address.
        data: billyBlockContract.methods.userBatchMintNFT(userWalletAddress, ipfs, colorHex, amount).encodeABI(),
        value: parseInt(amount * 1*10**9).toString()
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });

        return {
            result: (
                `<div>Successfully minted! Please return to the Home page to view the change onchain. View your transaction on <a href="https://polygonscan.com/tx/${txHash}">PolygonScan</a></div>`
            )
        };
    } catch (error) {
        return {
            result: "😥 " + error.message,
        };
    }
}
