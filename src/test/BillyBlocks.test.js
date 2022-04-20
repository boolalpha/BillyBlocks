// const PixelMap = artifacts.require("./PixelMap.sol");
require('dotenv').config();
const PIXELMAP_LIBRARY_ADDRESS = process.env.PIXELMAP_LIBRARY_ADDRESS;
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;

const { expect } = require("chai");

describe("BillyBlock", function () {
  it("BillyBlock Builder", async function () {
    const BillyBlock = await ethers.getContractFactory("BillyBlock",  {
      libraries: {
        PixelMap: PIXELMAP_LIBRARY_ADDRESS,
      },
    });

    // const greeter = await Greeter.deploy("Hello, world!");
    // await greeter.deployed();

    const billy_block = await BillyBlock.deploy();
    await billy_block.deployed();

    const setBatchTx = await billy_block.batchMintNFT(METAMASK_PUBLIC_KEY, "https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz", "8A2BE2", 2);
    await setBatchTx.wait();


    expect(await billy_block.getAllPixelId()).to.equal([1, 2]);
  });
});
