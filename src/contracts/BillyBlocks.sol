//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PixelMap.sol";

contract BillyBlocks is ERC721URIStorage, Ownable {
    using PixelMap for PixelMap.Map;
    using PixelMap for PixelMap.Pixel;

    PixelMap.Map private map;   // global map keeping track of all important info - due to inner structs must be private
    uint256 public lastTokenId;  // global int keeping track of last Id

    constructor() ERC721("BillyBlocks", "BILLY") {
        //the owner is set inside Ownable constructor
        lastTokenId = 1;
    }

    //These were for testing or possible logs to user may remove before true deploy
    event PixelMapId (
       uint256[] array
    );
    event PixelMapAddress (
       address[] array
    );
    event PixelMapColorHex (
       string[] array
    );
    event PixelMapIpfs (
       string[] array
    );

    function getMapSize()
        public view
        returns(uint256)
    {
        return map.size();
    }

    function getAllPixelId()
        public view
        returns (uint256[] memory)
    {
        return map.keys;
    }

    function getOnePixel(uint256 id)
        public view
        returns (uint256, address, string memory, string memory)
    {
        PixelMap.Pixel memory pixel = map.get(id);
        return (pixel.id, pixel.ownerAddress, pixel.colorHex, pixel.ipfsHttp);
    }

    function getAllPixels()
        public view
        returns (uint256[] memory, address[] memory, string[] memory, string[] memory)
    {
        uint256 curSize = map.size();

        uint256[] memory allIds = new uint256[](curSize);
        address[] memory allOwnerAddresses = new address[](curSize);
        string[] memory allHexStrings = new string[](curSize);
        string[] memory allIpfsStrings = new string[](curSize);

        for(uint256 i = 1; i < lastTokenId; i++) {
            PixelMap.Pixel memory pixel = map.get(i);
            allIds[i-1] = pixel.id;
            allOwnerAddresses[i-1] = pixel.ownerAddress;
            allHexStrings[i-1] = pixel.colorHex;
            allIpfsStrings[i-1] = pixel.ipfsHttp;
        }


        return (allIds, allOwnerAddresses, allHexStrings, allIpfsStrings);
    }

    function batchMintNFT(address recipient, string memory uri, string memory colorHex, uint256 amount)
        external onlyOwner checkIfPaused
    {

        for(uint256 i = 0; i < amount; i++) {
            //mint, set uri to token
            _mint(recipient, lastTokenId);
            _setTokenURI(lastTokenId, uri);

            //add to map
            PixelMap.Pixel memory defaultPixel;
            defaultPixel.id = lastTokenId;
            defaultPixel.ownerAddress = recipient;
            defaultPixel.colorHex = colorHex;
            defaultPixel.ipfsHttp = uri;

            map.set(lastTokenId, defaultPixel);

            //increment id
            lastTokenId++;

        }

        (uint256[] memory idArray, address[] memory addressArray, string[] memory colorHexArray, string[] memory ipfsArray) = getAllPixels();
        emit PixelMapId(idArray);
        emit PixelMapAddress(addressArray);
        emit PixelMapColorHex(colorHexArray);
        emit PixelMapIpfs(ipfsArray);
    }

    function userBatchMintNFT(address recipient, string memory uri, string memory colorHex, uint256 amount)
        external checkIfPaused payable
    {
        //require user to have sent 1 gwei
        require(
            msg.value >= (amount * 1*10**9),
            "Not enough money given. Pay more to BILLY. 1 GWEI per Pixel."
        );

        //transfer the value to owner
        payable(owner()).transfer(msg.value);

        //now do the same minting as for owner above
        for(uint256 i = 0; i < amount; i++) {
            //mint, set uri to token
            _mint(recipient, lastTokenId);
            _setTokenURI(lastTokenId, uri);

            //add to map
            PixelMap.Pixel memory defaultPixel;
            defaultPixel.id = lastTokenId;
            defaultPixel.ownerAddress = recipient;
            defaultPixel.colorHex = colorHex;
            defaultPixel.ipfsHttp = uri;

            map.set(lastTokenId, defaultPixel);

            //increment id
            lastTokenId++;

        }

        (uint256[] memory idArray, address[] memory addressArray, string[] memory colorHexArray, string[] memory ipfsArray) = getAllPixels();
        emit PixelMapId(idArray);
        emit PixelMapAddress(addressArray);
        emit PixelMapColorHex(colorHexArray);
        emit PixelMapIpfs(ipfsArray);
    }

    function batchEditMetadata(uint256[] memory listOfIds, string[] memory listOfHexStrings, string[] memory listOfNewIpfs)
        external
    {
        //this is our check that lists of equal length hae been given
        require(
            ((listOfIds.length == listOfHexStrings.length) && (listOfIds.length == listOfNewIpfs.length)),
            "BillyBlocks: mismatched length when editing color metadata. Must be 1-to-1."
        );

        for(uint256 i = 0; i < listOfIds.length; i++) {
            //get old pixel
            PixelMap.Pixel memory oldPixel = map.get(listOfIds[i]);

            //make sure this is the true owner of the id being edited
            require(
                (_msgSender() == oldPixel.ownerAddress),
                "BillyBlocks: you do not appear to be the owner of this Billy. Please use proper wallet."
            );

            //create new pixel
            PixelMap.Pixel memory newPixel;
            newPixel.id = listOfIds[i];
            newPixel.ownerAddress = oldPixel.ownerAddress;
            newPixel.colorHex = listOfHexStrings[i];
            newPixel.ipfsHttp = listOfNewIpfs[i];

            map.set(listOfIds[i], newPixel);

        }

        (uint256[] memory idArray, address[] memory addressArray, string[] memory colorHexArray, string[] memory ipfsArray) = getAllPixels();
        emit PixelMapId(idArray);
        emit PixelMapAddress(addressArray);
        emit PixelMapColorHex(colorHexArray);
        emit PixelMapIpfs(ipfsArray);
    }


    /*
        override the transfer and safetransfer functions
    */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        //solhint-disable-next-line max-line-length
        //be sure sender owns the token they are transfering
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        //set the new owner in the map
        //get old pixel
        PixelMap.Pixel memory oldPixel = map.get(tokenId);

        //create new pixel
        PixelMap.Pixel memory newPixel;
        newPixel.id = tokenId;
        newPixel.ownerAddress = to; //here is where we really are setting
        newPixel.colorHex = oldPixel.colorHex;
        newPixel.ipfsHttp = oldPixel.ipfsHttp;

        map.set(tokenId, newPixel);

        //perform actual transfer
        _transfer(from, to, tokenId);

        //emit update
        (uint256[] memory idArray, address[] memory addressArray, string[] memory colorHexArray, string[] memory ipfsArray) = getAllPixels();
        emit PixelMapId(idArray);
        emit PixelMapAddress(addressArray);
        emit PixelMapColorHex(colorHexArray);
        emit PixelMapIpfs(ipfsArray);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        //be sure sender owns the token they are transfering
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        //set the new owner in the map
        //get old pixel
        PixelMap.Pixel memory oldPixel = map.get(tokenId);

        //create new pixel
        PixelMap.Pixel memory newPixel;
        newPixel.id = tokenId;
        newPixel.ownerAddress = to; //here is where we adding new info
        newPixel.colorHex = oldPixel.colorHex;
        newPixel.ipfsHttp = oldPixel.ipfsHttp;
        map.set(tokenId, newPixel); //here is hwere the actual map gets set

        //perform actual safetransfer
        _safeTransfer(from, to, tokenId, _data);

        //emit update
        (uint256[] memory idArray, address[] memory addressArray, string[] memory colorHexArray, string[] memory ipfsArray) = getAllPixels();
        emit PixelMapId(idArray);
        emit PixelMapAddress(addressArray);
        emit PixelMapColorHex(colorHexArray);
        emit PixelMapIpfs(ipfsArray);
    }

    /*
        To be used with the above overriden safeTransferFrom
        Allows bulk transfer to help lower gas cost
    */
    function batchTransfer(
        address from,
        address to,
        uint256[] memory tokenIds
    ) external {
        for(uint256 i = 0; i < tokenIds.length; i++) {
            //dont require safety check b/c safeTransferFrom will do that
            safeTransferFrom(from, to, tokenIds[i], "");
        }

    }

    /*
        Create fallback function and event to notice
        I think this is overkill and solidity says only need for proxy or update design
        But implementing anyway
    */
    event FallbackEvent(address indexed _from, uint _value, string note);
    fallback() external payable
    {
        emit FallbackEvent(_msgSender(), msg.value, "Fallback function triggered");
    }
    receive() external payable {
        emit FallbackEvent(_msgSender(), msg.value, "Fallback function triggered");
    }

    /*
        The following is in case anyone finds a way to mess with contract it gives us time to fix
        This security measure is being followed as recommended by https://medium.com/coinmonks/common-attacks-in-solidity-and-how-to-defend-against-them-9bc3994c7c18
        The only function that uses this modifier is batchMint which can only be called by the owner in the first place
    */
    bool public contractPaused = false;
    event CircuitBreakerEvent(string note);
    function circuitBreaker()
        public onlyOwner
    {
        if (contractPaused == false) {
            contractPaused = true;
            emit CircuitBreakerEvent("Circuit breaker has been paused");
        }
        else {
            contractPaused = false;
            emit CircuitBreakerEvent("Circuit breaker has been resumed");
        }
    }
    // If the contract is paused, stop the modified function
    // Attach this modifier to all public functions
    modifier checkIfPaused() {
        require(contractPaused == false);
        _;
    }
}
