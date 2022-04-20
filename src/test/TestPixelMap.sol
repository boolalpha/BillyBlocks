//Library designed for Testing the PixelMap library
// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../contracts/PixelMap.sol";

contract TestPixelMap {
    using PixelMap for PixelMap.Map;
    using PixelMap for PixelMap.Pixel;

    PixelMap.Map private map;   // global map keeping track of all important info - due to inner structs must be private

    /*
        Should be called first because it will populate the global variable
    */
    function testMapSet() external {
        //set some default Pixels
        for(uint256 i = 0; i < 2; i++) {
            //add to map
            PixelMap.Pixel memory defaultPixel;
            defaultPixel.id = i;
            defaultPixel.ownerAddress = msg.sender;
            defaultPixel.colorHex = "8A2BE2";
            defaultPixel.ipfsHttp = "https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz";

            map.set(i, defaultPixel);
        }

        //new Pixel to existing id
        PixelMap.Pixel memory newPixel;
        newPixel.id = 1;
        newPixel.ownerAddress = msg.sender;
        newPixel.colorHex = "1E90FF";
        newPixel.ipfsHttp = "https://gateway.pinata.cloud/ipfs/QmYuUw2YjXbVGgo9zDuegAwiAT8Vh9ZL1EmcF6KtJTzaVe";

        map.set(1, newPixel);

        //assert the values are what we believe
        PixelMap.Pixel memory firstPixel = map.get(0);
        PixelMap.Pixel memory secondPixel = map.get(1);

        //tests for pixel 1
        assert(firstPixel.id == 0);
        assert(firstPixel.ownerAddress == msg.sender);
        assert(keccak256(bytes (firstPixel.colorHex)) == keccak256("8A2BE2"));
        assert(keccak256(bytes (firstPixel.ipfsHttp)) == keccak256("https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz"));

        //tests for pixel 2
        assert(secondPixel.id == 1);
        assert(secondPixel.ownerAddress == msg.sender);
        assert(keccak256(bytes (secondPixel.colorHex)) == keccak256("1E90FF"));
        assert(keccak256(bytes (secondPixel.ipfsHttp)) == keccak256("https://gateway.pinata.cloud/ipfs/QmYuUw2YjXbVGgo9zDuegAwiAT8Vh9ZL1EmcF6KtJTzaVe"));

    }

    /*
        This is redundant to the set test but specifically tests the get
    */
    function testMapGet() external {
        PixelMap.Pixel memory firstPixel = map.get(0);
        assert(firstPixel.id == 0);
        assert(firstPixel.ownerAddress == msg.sender);
        assert(keccak256(bytes (firstPixel.colorHex)) == keccak256("8A2BE2"));
        assert(keccak256(bytes (firstPixel.ipfsHttp)) == keccak256("https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz"));
    }

    function testMapGetKeyAtIndex() external {
        assert(map.getKeyAtIndex(0) == 0);
    }

    /*
        Must be called after the setter inputs the values
    */
    function testMapSize() external {
        assert(map.size() == 2);
    }

}
