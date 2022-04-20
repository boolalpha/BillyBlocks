// const PixelMap = artifacts.require("./PixelMap.sol");

const { expect } = require("chai");

describe("PixelMap", function () {
  it("Should test setting up the PixelMap", async function () {
    const PixelMap = await ethers.getContractFactory("PixelMap");
    // const greeter = await Greeter.deploy("Hello, world!");
    // await greeter.deployed();
    //
    // expect(await greeter.greet()).to.equal("Hello, world!");
    //
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    //
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    //
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
