require('dotenv').config();
// const PIXELMAP_LIBRARY_ADDRESS = process.env.PIXELMAP_LIBRARY_ADDRESS;
// const PIXELMAP_LIBRARY_ARBITRUM_ADDRESS = process.env.PIXELMAP_LIBRARY_ARBITRUM_ADDRESS;
const PIXELMAP_LIBRARY_MUMBAI_ADDRESS = process.env.PIXELMAP_LIBRARY_MUMBAI_ADDRESS;

async function main() {
    /*
        HOW WE DEPLOY PixelMap LIBRARY
    */
    // const PixelMap = await ethers.getContractFactory("PixelMap");
    // const pixel_map = await PixelMap.deploy();
    // console.log("Contract deployed to address:", pixel_map.address);

    /*
        HOW WE DEPLOY BillyBlocks CONTRACT
    */
    // link our custom library based on hardhat docs
    const BillyBlocks = await ethers.getContractFactory("BillyBlocks", {
        libraries: {
            PixelMap: PIXELMAP_LIBRARY_MUMBAI_ADDRESS,
        }
    });

    // Start deployment, returning a promise that resolves to a contract object
    const billy_blocks = await BillyBlocks.deploy();
    console.log("Contract deployed to address:", billy_blocks.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
