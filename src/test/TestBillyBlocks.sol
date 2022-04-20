//Library designed for Testing the BillyBlocks contract
// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../contracts/BillyBlock.sol";

contract TestBillyBlock {
    //our BillyBlock object used to test
    BillyBlock public testBilly = new BillyBlock();

    /*
        This should be ran first in order to establish nfts
    */
    function testBatchMint() public {
        //batchMint a pixel and assert that we are the owner
        testBilly.batchMintNFT(msg.sender, "https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz", "8A2BE2", 2);
        (, address ownerAddress, , ) = testBilly.getOnePixel(1);

        assert(ownerAddress == msg.sender);
    }

    /*
        Should run after mint
    */
    function testGetMapSize() public {
        assert(testBilly.getMapSize() == 2);
    }

    /*
        Should be ran after mint
    */
    function testGetAllPixelId() public {
        uint256[] memory allIds = testBilly.getAllPixelId();

        assert(allIds[0] == 1);
        assert(allIds[1] == 2);
    }

    /*
        Should be ran after mint
    */
    function testGetOnePixel() public {
        (uint256 id, , , ) = testBilly.getOnePixel(1);

        assert(id == 1);
    }

    /*
        Should be ran after mint
    */
    function testGetAllPixels() public {
        (uint256[] memory allIds, , , ) = testBilly.getAllPixels();

        assert(allIds.length == 2);
    }

    /*
        Should be ran after mint
    */
    function testbatchEditMetadata() public {
        uint256[] memory listOfIds;
        listOfIds[0] = 1;
        string[] memory listOfHexStrings;
        listOfHexStrings[0] = "1E90FF";
        string[] memory listOfNewIpfs;
        listOfNewIpfs[0] = "https://gateway.pinata.cloud/ipfs/QmYuUw2YjXbVGgo9zDuegAwiAT8Vh9ZL1EmcF6KtJTzaVe";
        testBilly.batchEditMetadata(listOfIds, listOfHexStrings, listOfNewIpfs);

        //assert color has changed
        (, , string memory colorHex, ) = testBilly.getOnePixel(1);
        assert(keccak256(bytes (colorHex)) == keccak256("1E90FF"));
    }

    /*
        Should be ran after mint
        Needs to use another address we own preferably not whoever deployed the contract
    */
    function testTransferFrom(address newOwnerAddress) public {
        testBilly.transferFrom(msg.sender, newOwnerAddress, 1);
        (, address ownerAddress, , ) = testBilly.getOnePixel(1);
        assert(ownerAddress == newOwnerAddress);
    }

    /*
        Should be ran after mint
        Needs to use another address we own preferably not whoever deployed the contract
    */
    function testSafeTransferFrom(address newOwnerAddress) public {
        testBilly.safeTransferFrom(msg.sender, newOwnerAddress, 1);
        (, address ownerAddress, , ) = testBilly.getOnePixel(1);
        assert(ownerAddress == newOwnerAddress);
    }

    /*
        Should be ran after mint
        Needs to use another address we own preferably not whoever deployed the contract
        Should transfer both minted nft to new owner
    */
    function testBatchTransfer(address newOwnerAddress) public {
        uint256[] memory idsToTransfer;
        idsToTransfer[0] = 1;
        idsToTransfer[1] = 2;
        testBilly.batchTransfer(msg.sender, newOwnerAddress, idsToTransfer);

        //test first transfer
        (, address ownerAddress, , ) = testBilly.getOnePixel(1);
        assert(ownerAddress == newOwnerAddress);
        //test second transfer
        (, ownerAddress, , ) = testBilly.getOnePixel(2);
        assert(ownerAddress == newOwnerAddress);
    }

    /*
        Should be ran after mint
        Needs to use 2 address we own preferably not whoever deployed the contract
        Should transfer both minted nft individually to new owners
    */
    function testMultiBatchTransfer(address[] memory newAddresses) public {
        uint256[] memory firstIdArray;
        firstIdArray[0] = 1;
        uint256[] memory secondIdArray;
        secondIdArray[0] = 2;

        uint256[][] memory bothIdArray;
        bothIdArray[0] = firstIdArray;
        bothIdArray[1] = secondIdArray;

        testBilly.multiBatchTransfer(msg.sender, newAddresses, bothIdArray);

        //test first transfer
        (, address ownerAddress, , ) = testBilly.getOnePixel(1);
        assert(ownerAddress == newAddresses[0]);
        //test second transfer
        (, ownerAddress, , ) = testBilly.getOnePixel(2);
        assert(ownerAddress == newAddresses[1]);
    }

}
