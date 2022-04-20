import React from "react";
import { useEffect, useState, useRef } from "react";

import {
    billyBlockContract,
    connectWallet,
    loadCurrentAmountMinted,
    loadCurrentPixelMap,
    getCurrentWalletConnected,
    sendTransfer,
    pinJSONToPinata,
    sendEdit,
    sendMint
} from "./util/interactions.js";

import { MapInteraction } from 'react-map-interaction';

import './css/reset.css';
import './css/helix.css';

import trash from './img/trash.png';
import wallet from './img/wallet.png';
import find from './img/find.png';
import edit from './img/edit.png';
import home from './img/home.png';
import transfer from './img/transfer.png';
import mint from './img/mint.png';
import menu from './img/menu.png';
import close from './img/close.png';
import logo from './img/logo.png';
import expand from './img/expand.png';

import addMumbaiVideo from './video/howTo/AddMumbai.mp4';
import connectWalletVideo from './video/howTo/ConnectWallet.mp4';
import editCoinVideo from './video/howTo/EditCoin.mp4';
import getInfoVideo from './video/howTo/GetInfo.mp4';
import mintCoinVideo from './video/howTo/MintCoin.mp4';
import testnetFaucetVideo from './video/howTo/TestnetFaucet.mp4';
import transferCoinVideo from './video/howTo/TransferCoin.mp4';

const BDNFT = () => {
    //global
    var mainZoom = 1;
    var secondZoom = 1;

    var globalPixelMap = [];

    const svgRef = useRef(null);

    //state variables

    const [walletAddress, setWallet] = useState("");
    const [amountMinted, setAmountMinted] = useState("No connection to the network."); //default message

    const [pixelMap, setPixelMap] = useState();
    const [stateGlobalPixelMap, setStateGlobalPixelMap] = useState([]);

    const [blockViewer, setBlockViewer] = useState();

    const [displayInfo, setDisplayInfo] = useState(false);
    const [displayInfoAddress, setDisplayInfoAddress] = useState("No address set");
    const [displayInfoPixelId, setDisplayInfoPixelId] = useState("n/a");
    const [displayInfoPixelColorHex, setDisplayInfoPixelColorHex] = useState("none");

    const [displayTransfer, setDisplayTransfer] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [displayMint, setDisplayMint] = useState(false);

    const [containerHeight, setContainerHeight] = useState("100vh");

    useEffect(async () => {
        // console.log();
        var height =  100 * window.innerHeight * 0.01 + "px";
        setContainerHeight(height);

        const currentAmountMinted = await loadCurrentAmountMinted();

        setAmountMinted(currentAmountMinted);

        const currentPixelMap = await loadCurrentPixelMap();
        // const currentPixelMap = loadFakePixelMap();
        globalPixelMap = currentPixelMap;
        setStateGlobalPixelMap(currentPixelMap);
        setPixelMap(PixelMap({currentPixelMap:globalPixelMap}));

        /* Contract event listening doesnt work on polygon ? */
        // addSmartContractListener();

        const { address, status } = await getCurrentWalletConnected();

        setWallet(address);
        // setStatus(status);

        addWalletListener();

        // const svg = svgRef.current;
        // const context = canvas.getContext('2d');
        draw(svgRef.current, currentPixelMap);

        // attachButtonListeners();

    }, []);

    /* THIS WAS NECESSARY FOR BUTTONS TO WORK ON METAMASK MOBILE BROWSER IDK WHY */
    // const attachButtonListeners = () => {
    // function attachButtonListeners() {

    // }

    function addSmartContractListener() {
        // billyBlockContract.events.PixelMapId({}, (error, data) => {
        //     if (error) {
        //         console.error("😥 " + error.message);
        //     } else {
        //         console.log("🎉 Contract has been updated!");
        //         console.log(data);
        //     }
        // });
        // billyBlockContract.events.PixelMapAddress({}, (error, data) => {
        //     if (error) {
        //         console.error("😥 " + error.message);
        //     } else {
        //         console.log("🎉 Contract has been updated!");
        //         console.log(data);
        //     }
        // });
        // billyBlockContract.events.PixelMapColorHex({}, (error, data) => {
        //     if (error) {
        //         console.error("😥 " + error.message);
        //     } else {
        //         console.log("🎉 Contract has been updated!");
        //         console.log(data);
        //     }
        // });
        // billyBlockContract.events.PixelMapIpfs({}, (error, data) => {
        //     if (error) {
        //         console.error("😥 " + error.message);
        //     } else {
        //         console.log("🎉 Contract has been updated!");
        //         console.log(data);
        //     }
        // });
    }

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    // setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    setWallet("");
                    // setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
        } else {
            console.log(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        // setStatus(walletResponse.status);
        setWallet(walletResponse.address);
        setBlockViewer(BlockViewer({address:walletResponse.address, startSize: secondZoom, currentPixelMap: stateGlobalPixelMap}));
    };

    function loadFakePixelMap() {
        var returnMap = {};

        var numOwners = 10;
        var pixelId = 0;

        for(var i = 0; i < numOwners; i++) {
            var fakeOwnerAddress = "0x" + i;
            // var ownerObj = {"owner": fakeOwnerAddress, "pixels": }
            // var ownerPixelList = [];

            //create random num of pixels
            var numPixels = parseInt(Math.random() * (10000 - 1) + 1);
            // var numPixels = 10000;
            // var randomColor = (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

            for(var j = 0; j < numPixels; j++) {
                var randomColor = (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
                var pixelObject = {
                    'id': pixelId,
                    'colorHex': randomColor,
                    'ipfsHttp': "https://gateway.pinata.cloud/ipfs/Qmdh3PoS617GhBz4gEea7uQQVteAY21i34x4bDKzMqdhrz"
                };
                pixelId++;

                if(fakeOwnerAddress in returnMap) {
                    //create pixel list and add new
                    returnMap[fakeOwnerAddress].push(pixelObject);
                } else {
                    //add pixel to existing
                    returnMap[fakeOwnerAddress] = [pixelObject];
                }
            }
        }

        var pixelMapArray = [];
        for (let [key, value] of Object.entries(returnMap)) {
            pixelMapArray.push({"owner": key, "pixels": value});
        }

        //need to sort the array of objects
        pixelMapArray.sort((a, b) => {
            return ((a["pixels"].length - b["pixels"].length) * (-1));  //this returns a before b if positive so we multiply by -1 to get descending
        });

        return pixelMapArray;
    }

    const draw = (svg, pixelMap) => {
        // console.log(pixelMap);
        // console.log(svg);
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        var isPortrait = (window.innerWidth < window.innerHeight);

        var NS = svg.getAttribute('xmlns');

        var pixelSize = mainZoom * 10;
        var gap = 10;

        var finalSizeLength = (pixelMap.length>0) ? Math.ceil(Math.sqrt(pixelMap[0].pixels.length)) : 100;

        var start = 0;

        for(var wallet = 0; wallet < pixelMap.length; wallet++) {

            var square = Math.ceil(Math.sqrt(pixelMap[wallet].pixels.length));

            // console.log(wallet);
            for(var pixel = 0; pixel < pixelMap[wallet].pixels.length; pixel++) {

                // console.log(Math.floor(wallet));

                var x = pixel%square;
                var y = Math.floor(pixel / square);
                // console.log(x);
                // console.log(y);
                // console.log(pixelMap[wallet].pixels[pixel].colorHex);

                var r = document.createElementNS(NS, 'rect');

                if(isPortrait) {
                    r.setAttribute("x", (x*pixelSize));
                    r.setAttribute("y", start+(y*pixelSize));
                } else {
                    r.setAttribute("x", start+(x*pixelSize));
                    r.setAttribute("y", (y*pixelSize));
                }

                r.setAttribute("width", pixelSize);
                r.setAttribute("height", pixelSize);
                // r.setAttribute("rx", "5"); //if we want the pixels to be circles
                r.setAttribute("fill", "#"+pixelMap[wallet].pixels[pixel].colorHex);

                r.pixelMap = pixelMap;
                r.owner = pixelMap[wallet].owner;

                r.style.cursor = "pointer";

                r.addEventListener('click', function(e) {
                    // e.stopPropagation();
                    var t = e.target;
                    setBlockViewer(BlockViewer({address:t.owner, startSize: secondZoom, currentPixelMap: t.pixelMap}));
                    setDisplayInfoAddress(t.owner);
                    activateInfoDisplay();
                });

                r.addEventListener('touchstart', function(e) {
                    // e.stopPropagation();
                    var t = e.target;
                    setBlockViewer(BlockViewer({address:t.owner, startSize: secondZoom, currentPixelMap: t.pixelMap}));
                    setDisplayInfoAddress(t.owner);
                    activateInfoDisplay();
                });

                svg.appendChild(r);
            }

            start += (square * pixelSize) + gap;

        }

        if(isPortrait) {
            svg.setAttribute("height", start + "px");
            svg.setAttribute("width", (finalSizeLength * pixelSize) + (gap * 2) + "px");
        } else {
            svg.setAttribute("width", start + "px");
            svg.setAttribute("height", (finalSizeLength * pixelSize) + (gap * 2) + "px");
        }

    }

    /*
        Following functions are for displaying different widgets
    */

    function showMainPixelMap() {
        // setOpenViewer(false);
        document.getElementById("blockViewerContainer").classList.remove("openBlockViewer");
    }

    function activateInfoDisplay() {
        //we hide mapinteraction in Mint so make sure it is visible
        var personalMapInteraction = document.getElementById("blockViewerMapInteractionContainer");
        if(personalMapInteraction !== null){
            personalMapInteraction.style.display = "flex";
        }

        setDisplayInfo(true);
        setDisplayTransfer(false);
        setDisplayEdit(false);
        setDisplayMint(false);
        // activateDisplayController("infoController");

        // setOpenViewer(true);
        document.getElementById("blockViewerContainer").classList.add("openBlockViewer");
    }

    function activateTransferDisplay() {
        //we hide mapinteraction in Mint so make sure it is visible
        var personalMapInteraction = document.getElementById("blockViewerMapInteractionContainer");
        if(personalMapInteraction !== null){
            personalMapInteraction.style.display = "flex";
        }

        setDisplayInfo(false);
        setDisplayTransfer(true);
        setDisplayEdit(false);
        setDisplayMint(false);
        // activateDisplayController("transferController");

        // setOpenViewer(true);
        document.getElementById("blockViewerContainer").classList.add("openBlockViewer");
    }

    function activateEditDisplay() {
        //we hide mapinteraction in Mint so make sure it is visible
        var personalMapInteraction = document.getElementById("blockViewerMapInteractionContainer");
        if(personalMapInteraction !== null){
            personalMapInteraction.style.display = "flex";
        }

        setDisplayInfo(false);
        setDisplayTransfer(false);
        setDisplayEdit(true);
        setDisplayMint(false);
        // activateDisplayController("editController");

        // setOpenViewer(true);
        document.getElementById("blockViewerContainer").classList.add("openBlockViewer");
    }

    function activateMintDisplay() {
        //we hide mapinteraction in Mint so make sure it is visible
        var personalMapInteraction = document.getElementById("blockViewerMapInteractionContainer");
        if(personalMapInteraction !== null){
            personalMapInteraction.style.display = "flex";
        }

        setDisplayInfo(false);
        setDisplayTransfer(false);
        setDisplayEdit(false);
        setDisplayMint(true);

        document.getElementById("blockViewerContainer").classList.add("openBlockViewer");
    }

    /*
        Following BlockViewer and BlockViewerPixel are for the popup that shows values
    */
    const BlockViewer = (props) => {
        var address = props.address;
        var startSize = props.startSize;
        var currentPixelMap = props.currentPixelMap;

        var numPixels = 0;
        var pixelWidth = 0;
        var walletPixels = [];
        if(address.length > 0) {
            //filter to get the user's pixels
            walletPixels = currentPixelMap.filter(obj => {
                return obj.owner.toLowerCase() === address.toLowerCase();
            });

            if(walletPixels.length > 0) {
                walletPixels = walletPixels[0].pixels;

                numPixels = walletPixels.length;

                pixelWidth = Math.ceil(Math.sqrt(numPixels));
            }

        } else {
            console.log("NO BILLYS TO SHOW");
        }

        //create html for our walletBlock
        var innerPixels = [];

        for(var i = 0; i < walletPixels.length; i++) {
            innerPixels.push(<BlockViewerPixel props={{pixelInfo: walletPixels[i], width: pixelWidth, startSize: startSize}} key={i}/>);  //not sure if making key=i is proper
        }

        if(innerPixels.length === 0) {
            innerPixels.push(<div id="noBillyErrorMessage">You Have No BILLYs</div>);
        }

        return (
            <div id="blockViewerMapInteractionContainer">
                <div className="redrawContainer">
                    <div
                        className="redrawIncrease"
                        onClick={() => {
                            secondZoom++;
                            setBlockViewer(BlockViewer({address:address, startSize: secondZoom, currentPixelMap: currentPixelMap}));
                        }}
                    >+</div>
                    <div
                        className="redrawDecrease"
                        onClick={() => {
                            if(secondZoom > 1) {
                                secondZoom--;
                                setBlockViewer(BlockViewer({address:address, startSize: secondZoom, currentPixelMap: currentPixelMap}));
                            }
                        }}
                    >-</div>
                </div>
                <MapInteraction>
                {
                    ({ translation, scale }) => {
                        // console.log('width', ref.current ? ref.current.offsetWidth : 0);
                        return (
                            <div id="blockViewerPixelContainer"
                                style={{
                                    // width: (zoomSize*10 * pixelWidth) + (pixelWidth*2) + "px",
                                    // height: "250px",
                                    // backgroundColor: "gold",
                                    marginTop: "calc(125px + 2vmin)",
                                    transformOrigin: "0px 0px 0px",
                                    transform: "matrix("+scale+ ", 0, 0, " + scale + ", "+ translation.x + ", " + translation.y + ")",
                                    // display: "inline-block"
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-block",
                                        width: ((30 + (10 * secondZoom)) * startSize * pixelWidth) + (pixelWidth*2) + "px",
                                    }}
                                >
                                    {innerPixels}
                                </div>
                            </div>
                        );
                    }
                }
                </MapInteraction>
            </div>
        );
    }

    const BlockViewerPixel = (props) => {
        var pixelInfo = props.props.pixelInfo;
        var width = props.props.width;
        var startSize = props.props.startSize;

        return (
            <div className="blockViewerPixel"
                style={{
                    backgroundColor: "#"+pixelInfo.colorHex,
                    width: ((30 + (10 * secondZoom)) * startSize)+"px",
                    height: ((30 + (10 * secondZoom)) * startSize)+"px",
                    float: "left"
                }}
                onClick={(e) => {
                    // e.stopPropagation();
                    if(document.getElementsByClassName("activeDisplayController").length > 0) {
                        var activeId = document.getElementsByClassName("activeDisplayController")[0].id;
                        if(activeId === "transferController") {
                            addToTransfer(pixelInfo);
                        } else if(activeId === "editController") {
                            addToEdit(e, pixelInfo);
                        } else if(activeId == "infoController") {
                            addToInfo(pixelInfo);
                        } else if(activeId == "mintController") {
                            console.log("This pixel is #"+pixelInfo.colorHex);
                        }
                    }

                }}
                onTouchStart={(e) => {
                    // e.stopPropagation();
                    if(document.getElementsByClassName("activeDisplayController").length > 0) {
                        var activeId = document.getElementsByClassName("activeDisplayController")[0].id;
                        if(activeId === "transferController") {
                            addToTransfer(pixelInfo);
                        } else if(activeId === "editController") {
                            addToEdit(e, pixelInfo);
                        } else if(activeId == "infoController") {
                            addToInfo(pixelInfo);
                        } else if(activeId == "mintController") {
                            console.log("This pixel is #"+pixelInfo.colorHex);
                        }
                    }

                }}
            >
                {pixelInfo.id}
            </div>
        );
    }

    /*
        Following Info, Transfer, Edit parts are for the block viewer display controls
    */
    //INFO SECTION START
    const Info = (props) => {
        var rank = stateGlobalPixelMap.findIndex(wallet => wallet.owner.toLowerCase() === displayInfoAddress.toLowerCase()) + 1;
        if (rank === 0) {
            rank = "None";
        }

        return (
            <div id="infoController" className={`displayControllerContainer ${displayInfo ? 'activeDisplayController' : ''}`}>
                <div id="pixelInfoContainer">Click pixel to get info
                    <div id="pixelInfoDisplayContainer">Pixel Info:
                        <div id="pixelInfoDisplayContent">
                            <div className="pixelInfoHolder">
                                <div className="pixelInfoHolderHeader">ID:</div>
                                <div className="pixelInfoHolderValue">{displayInfoPixelId}</div>
                            </div>
                            <div className="pixelInfoHolder">
                                <div className="pixelInfoHolderHeader">COLOR HEX:</div>
                                <div className="pixelInfoHolderValue">#{displayInfoPixelColorHex}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="ownerInfoContainer">Owner:
                    <div id="ownerInfoAddress">{displayInfoAddress}</div>
                </div>
                <div id="rankInfoContainer">Wallet Rank:
                    <div id="rankInfoValue"><div id="rankValueMain">{rank}</div> / {stateGlobalPixelMap.length}</div>
                </div>
            </div>
        );
    }

    function addToInfo(pixel) {
        setDisplayInfoPixelId(pixel.id);
        setDisplayInfoPixelColorHex(pixel.colorHex);
    }
    //TRANSFER SECTION START
    const Transfer = (props) => {
        return (
            <div id="transferController" className={`displayControllerContainer ${displayTransfer ? 'activeDisplayController' : ''}`}>
                <div id="transferSelectBillyContainer">
                    Select the Billys you would like to transfer
                    <div id="transferBillyHolder"></div>
                </div>
                <div id="transferAddressContainer">
                    <div>Enter the address to transfer the Billys to</div>
                    <input id="transferAddressInput" type="text" placeholder="Address To Transfer To" />
                </div>
                <div id="transferCheckContainer">
                    <input type="checkbox" id="transferConsent"/>
                    <label id="transferConsentLabel" htmlFor="transferConsent"> Yes, I understand all the implications of sending away my Billys!</label>
                </div>
                <div id="transferButton" onClick={web3SendTransfer}>Transfer Billys</div>
            </div>
        );
    }

    // 2 additional functions are needed to make transfer work
    function addToTransfer  (pixel)  {
        var htmlHolder = document.getElementById("transferBillyHolder");
        // console.log(htmlHolder.children);

        var pixelInArray = false;
        for(var i = 0; i < htmlHolder.children.length; i++) {
            if(htmlHolder.children[i].children[0].innerHTML === pixel.id) {
                pixelInArray = true;
                break;
            }
        }

        if(pixelInArray !== true) {
            var html = `
                <div class="transferPixel" style="background-color: #` + pixel.colorHex + `">
                    <div class="transferPixelId">` + pixel.id + `</div>
                    <div class="transferPixelHex">#` + pixel.colorHex + `</div>
                    <div class="transferPixelRemove" onclick="this.parentNode.remove();">Remove</div>
                </div>
            `;

            // console.log(html);

            htmlHolder.innerHTML += html;
        }
    }

    const web3SendTransfer = async () => {

        var htmlHolder = document.getElementById("transferBillyHolder");
        var idToTransfer = [];
        //create array of id
        var idAreValid = true;
        for(var i = 0; i < htmlHolder.children.length; i++) {
            var id = parseInt(htmlHolder.children[i].children[0].innerHTML);
            //check that all interior are numbers (no tampering)
            if(isNaN(id)){
                console.error("There is something wrong with a given ID. Cannot be converted to a number.");
                idAreValid = false;
                // throw 'Error in IDs';
                displayPopUpMessage("There is something wrong with a given Transfer Billy ID. Cannot be converted to a number. Please contact support if you believe this is in error.");
            } else {
                //push to array
                idToTransfer.push(id);
            }
        }

        if(idAreValid) {
            if(idToTransfer.length <= 0 ) {
                displayPopUpMessage("There are no Billys in your Transfer List!");
            } else {

                var addressToTransferTo = document.getElementById("transferAddressInput").value;

                if(addressToTransferTo.length > 0) {
                    var confirmCheck = document.getElementById("transferConsent").checked;

                    //user has confirmed checked
                    if(confirmCheck) {
                        showLoading();

                        // console.log(idToTransfer);
                        // console.log(walletAddress);
                        // console.log(addressToTransferTo);

                        const { result } = await sendTransfer(walletAddress, addressToTransferTo, idToTransfer);
                        // console.log(result);

                        //update block viewer and pixel map
                        closeLoading();
                        displayPopUpRefreshMessage(result);
                    } else {
                        console.log("You must check/confirm that you want to make this transfer.");
                        displayPopUpMessage("You must click the checkbox to confirm that you want to make this transfer, that the Transfer Address is correct, and that you understand that transfering these Billys relinquishes your ownership.");
                    }
                } else {
                    console.log("You cannot leave the Address blank.");
                    displayPopUpMessage("You cannot leave the Transfer Address blank. Be sure you are entering the correct address you want to tranfer to.");
                }
            }
        }
    }

    const Edit = (props) => {
        const [editColor, setEditColor] = useState("#1e90ff");

        return (
            <div id="editController" className={`displayControllerContainer ${displayEdit ? 'activeDisplayController' : ''}`}>
                Double-click your Billy to change its color
                <div id="editColorSelectContainer">
                    <div id="editColorSelectInputWrapper" style={{backgroundColor: editColor}}>
                        <input id="editColorSelectInput" type="color" value={editColor} onChange={(e) => {setEditColor(e.target.value);}}></input>
                    </div>
                    <div id="editColorSelectHexText">
                        {editColor}
                    </div>
                </div>
                <div id="editChangesMadeContainer">
                    <div id="editChangesMadeTitle">Edited Pixels List</div>
                    <div id="editChangesMadeHolder"></div>
                </div>
                <div id="editButton" onClick={web3SendEdit}>Edit Billy Colors</div>
            </div>
        );
    }

    function addToEdit(clickEvent, pixel) {
        //get color input value
        var currentColorValue = document.getElementById("editColorSelectInput").value;

        //change pixel background color to input value
        clickEvent.target.style.backgroundColor = currentColorValue;

        //add pixel/new color to html holder
        var html = '';
        var htmlHolder = document.getElementById("editChangesMadeHolder");

        var pixelIndex = null;
        for(var i = 0; i < htmlHolder.children.length; i++) {
            if(htmlHolder.children[i].children[0].innerHTML === pixel.id) {
                pixelIndex = i;
                break;
            }
        }

        if(pixelIndex !== null) {
            htmlHolder.children[pixelIndex].style.backgroundColor = currentColorValue;
            htmlHolder.children[pixelIndex].children[1].innerHTML = currentColorValue;
        } else {
            html = `
                <div class="editPixel" style="background-color: ` + currentColorValue + `">
                    <div class="editPixelId">` + pixel.id + `</div>
                    <div class="editPixelHex">` + currentColorValue + `</div>
                    <div class="editPixelRemove" onclick="javascript:(function() {
                        var blockViewerPixels = document.getElementsByClassName('blockViewerPixel');
                        for(var i = 0; i < blockViewerPixels.length; i++) {
                            if(blockViewerPixels[i].innerHTML === '` + pixel.id + `') {
                                blockViewerPixels[i].style.backgroundColor = '#` + pixel.colorHex + `';
                            }
                        }
                    })();
                    this.parentNode.remove();
                    "><img src=${trash} class="trashImg"></img></div>
                </div>
            `;
            htmlHolder.innerHTML += html;
        }

    }

    const rgb2hex = (rgb) => `${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;

    const web3SendEdit = async () => {

        //list of ids, list of color hex, list of new ipfs which will have to be created in pinata from interactions
        var innerEditElements = document.getElementById("editChangesMadeHolder").children;

        //if nothing in list show pop up
        if(innerEditElements.length === 0) {
            displayPopUpMessage("You have no Billys in your Edit list!");
        } else {
            showLoading();

            var idList = [];
            var colorHexList = [];
            var newIpfsList = [];
            //get list of edits to make
            for(var i = 0; i < innerEditElements.length; i++) {
                colorHexList.push(rgb2hex(innerEditElements[i].style.backgroundColor));
                idList.push(innerEditElements[i].children[0].innerText);
            }

            var ipfsList = await pinJSONToPinata(colorHexList);

            // check that we havent errored from pinata
            if(!Array.isArray(ipfsList)) {
                //show error pop up
                displayPopUpMessage("Something has gone wrong and we recieved an Error. Don't worry your transaction has not processed. Please try again, and if the problem persists contact support.")
            } else {
                //send to imported contract function
                const { result } = await sendEdit(walletAddress, idList, colorHexList, ipfsList);
                // console.log(result);

                //update block viewer and pixel map
                closeLoading();
                displayPopUpRefreshMessage("Successfully edited Billy colors! Please return to the Home page to view the color change onchain.");

            }
        }
    }

    const Mint = (props) => {
        const [mintColor, setMintColor] = useState("#1e90ff");

        return (
            <div id="mintController" className={`displayControllerContainer ${displayMint ? 'activeDisplayController' : ''}`}>
                <div>Select the color of your new BILLYs</div>
                <div id="mintColorSelectInputWrapper" style={{backgroundColor: mintColor}}>
                    <input id="mintColorSelectInput" type="color" value={mintColor} onChange={(e) => {setMintColor(e.target.value);}}></input>
                </div>
                <div id="mintColorSelectHexText">
                    {mintColor}
                </div>
                <div id="mintAmountHeader">Amount to mint</div>
                <div id="mintAmountContainer">
                    <div id="mintAmountInputContainer">
                        <input id="mintAmountInput" type="number" defaultValue="1" step="1" min="1" onChange={verifyInput}/>
                        <div id="mintAmountButtonContainer">
                            <div id="mintAmountButtonIncrease" onClick={increaseMintAmount}>+</div>
                            <div id="mintAmountButtonDecrease" onClick={decreaseMintAmount}>-</div>
                        </div>
                    </div>
                    <div id="mintAmountPriceText">x <div id="mintCurrentPrice">1 GWEI</div> + GAS</div>
                </div>
                <div id="mintButton" onClick={web3SendUserMint}>Mint BILLYs</div>

            </div>
        );

    }

    function decreaseMintAmount() {
        //get current amount and make sure new val wont be negative
        var inputElem = document.getElementById("mintAmountInput");

        var curValue = parseInt(inputElem.value);
        var newValue = curValue - 1;

        if(newValue >= 1) {
            inputElem.value = newValue;
        } else {
            inputElem.value = 1;
        }
    }

    function increaseMintAmount() {
        //get current amount and make sure new val wont be negative
        var inputElem = document.getElementById("mintAmountInput");

        var curValue = parseInt(inputElem.value);
        var newValue = curValue + 1;

        if(newValue >= 1) {
            inputElem.value = newValue;
        } else {
            inputElem.value = 1;
        }
    }

    function verifyInput() {
        //get current amount and make sure new val wont be negative
        var inputElem = document.getElementById("mintAmountInput");

        if(inputElem.value !== "") { //this allows user to backspace to empty
            if(inputElem.value < 1) {
                inputElem.value = 1;
            }
        }
    }

    const web3SendUserMint = async () => {
        showLoading();
        //get the color hex
        var colorHex = document.getElementById("mintColorSelectInput").value.substring(1);
        //get the amount
        var amount = document.getElementById("mintAmountInput").value;
        //pin and get the pinata hash -- only one because same color for all
        var ipfs = await pinJSONToPinata([colorHex]);
        ipfs = ipfs[0]; //we have to separate this from above command of the await wont work

        //we know to get user address
        const { result } = await sendMint(walletAddress, ipfs, colorHex, amount);
        // console.log(result);
        //update block viewer and pixel map
        closeLoading();
        displayPopUpRefreshMessage(result);

    }

    /*
        Following PixelMap, WalletBlock, Pixel parts are for main page functionality
    */
    const PixelMap = (props) => {


        var currentPixelMap = props.currentPixelMap;

        return (
            <div id="pixelMapDisplayContainer">
                <div className="redrawContainer">
                    <div
                        className="redrawIncrease"
                        onClick={() => {
                            mainZoom++;
                            draw(svgRef.current, currentPixelMap);
                        }}
                    >+</div>
                    <div
                        className="redrawDecrease"
                        onClick={() => {
                            if(mainZoom > 1) {
                                mainZoom--;
                                draw(svgRef.current, currentPixelMap);
                            }
                        }}
                    >-</div>
                </div>
                <MapInteraction onClick={(e)=>{e.stopPropagation(); e.preventDefault();}}>
                    {
                        ({ translation, scale }) => {
                            /* Use the passed values to scale content on your own. */
                            return (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        marginTop: "calc(125px + 2vmin)",
                                        transformOrigin: "0px 0px 0px",
                                        transform: "matrix("+scale+ ", 0, 0, " + scale + ", "+ translation.x + ", " + translation.y + ")"
                                    }}
                                >
                                    <svg
                                        ref={svgRef}
                                        height="100px" width="100px"
                                        xmlns="http://www.w3.org/2000/svg"
                                        id="mainPixelMapSvg"
                                    />
                                </div>
                            );
                        }
                    }
                </MapInteraction>
            </div>
        );
    }

    /*
        PopUp & Loading Widget Functions
    */
    function closeMenu() {
        document.getElementById("menuContainer").style.display = "none";
    }

    function showMenu() {
        document.getElementById("menuContainer").style.display = "flex";
    }

    function setElementActive(target) {
        document.getElementById("activeMenuTab").id = "";
        target.id = "activeMenuTab";
    }

    function setBackgroundColorEvent(color) {
        document.getElementById("container").style.backgroundColor = color;
        document.getElementById("blockViewerContainer").style.backgroundColor = color;
    }

    function getRandomHex() {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }

    function expandVideo(e) {
        console.log(e.target);

        e.target.parentNode.parentNode.style.height = "auto";
        e.target.style.display = "none";
        e.target.parentNode.children[1].style.display = "flex";
    }

    function closeVideo(e) {
        console.log(e.target);

        e.target.parentNode.parentNode.style.height = "50px";
        e.target.style.display = "none";
        e.target.parentNode.children[0].style.display = "flex";
    }

    const VideoExpander = (props) => {
        return (
            <div className="videoExpander" >
                <div className="expanderOpen" onClick={expandVideo}>
                    <img className="expanderImg imgOpen" src={expand} />
                    <div className="expanderText" >Open Video</div>
                    <img className="expanderImg imgOpen"  src={expand} />
                </div>
                <div className="expanderClose" onClick={closeVideo}>
                    <img className="expanderImg imgClose"  src={expand} />
                    <div className="expanderText" >Close Video</div>
                    <img className="expanderImg imgClose"  src={expand} />
                </div>
            </div>
        );
    }

    const Menu = (props) => {
        const [menuDisplay, setMenuDisplay] = useState("showWhitepaper");
        const [backgroundColor, setBackgroundColor] = useState("#f8f8ff");

        return (
            <div id="menuContainer" onClick={closeMenu}>
                <div id="closeMenuButton" onClick={closeMenu}>
                    <img className="menuImg" src={close}></img>
                    Close
                </div>
                <div id="menuContent" onClick={(e) => {e.stopPropagation();}}>
                    <div id="menuTabContainer">
                        <div id="activeMenuTab" className="menuTab" onClick={(e) => {
                            setMenuDisplay("showWhitepaper");
                            setElementActive(e.target);
                        }}>Whitepaper</div>
                        <div className="menuTab" onClick={(e) => {
                            setMenuDisplay("showHowTo");
                            setElementActive(e.target);
                        }}>How To</div>
                        <div className="menuTab" onClick={(e) => {
                            setMenuDisplay("showExtra");
                            setElementActive(e.target);

                        }}>Extra</div>
                    </div>
                    <div id={menuDisplay} className="menuContentHolder">
                        <div className="menuContentPage">
                            <ul className="menuContentPageList">
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">This a proof-of-concept project deployed on the Polygon blockchain test network (Mumbai).</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Because this is on the test network it does not cost any real money, and is intended to be an educational tool that anyone can participate in to get familiar with NFT/Web3.0 projects and the abilities of the Polygon blockchain.</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">The goal of this project is to give people a template project for creating their own projects with the Solidity programming language.</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">In order to set up your account, fund wallet with test tokens, and mint a pixel: please view the How To section.</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Cost to mint: 1 Gwei = 1 BillyBlock Pixel</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">All wallets are displayed as a square of the amount they own</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Wallets with greatest amount of pixels will be displayed on top benefiting those with more in the pot.</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">All metadata is stored on IPFS (decentralized data storage).</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Idea to be a Finviz style coin - meaning it allows you to visualize the supply/demand and price/popularity of a token or nft by seeing how many owners there are</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">You edit the metadata (on our website which then accesses the contract) of your Coin to change the color, allowing for the NFT to be a recreatable piece of pixel art for as long as the Polygon network survives.</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">There are many different ways this type of storage can be used for other projects:</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="spacer" /><div className="menuBullet"/><div className="menuItemText">Could change the cost of minting for custom tokenomics</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="spacer" /><div className="menuBullet"/><div className="menuItemText">Could have multiple editable attributes other than just color for NFT customization</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="spacer" /><div className="menuBullet"/><div className="menuItemText">Could be used as storage of coins for gaming projects (video games, casinos, etc)</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="menuContentPage">
                            <ul className="menuContentPageList">
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Connect Metamask Wallet</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={connectWalletVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Add Polygon Test Network (Mumbai) To Metamask</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={addMumbaiVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Fund Wallet With Test Tokens from A Faucet</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={testnetFaucetVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Mint A Coin</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={mintCoinVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Edit Coin Color</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={editCoinVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Transfer Coin</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={transferCoinVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                                <li>
                                    <div className="listItemHolder">
                                        <div className="menuBullet"/><div className="menuItemText">Get Coin Information</div>
                                    </div>
                                    <div className="videoContainer">
                                        <video controls muted loop className="howToVideo" loading="lazy"><source src={getInfoVideo} type="video/mp4" /></video>
                                        <VideoExpander />
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="menuContentPage">
                            <div className="menuContentPageRow">Developed by <a href="https://www.boolalpha.com">boolalpha</a> from michigan</div>
                            <div className="menuContentPageRow">The BillyBlock Contract can be found <a href="https://github.com/boolalpha/SmartContracts/tree/main/BillyBlocks">here</a></div>
                            <div className="menuContentPageRow">For help adding Polygon/MATIC to your Metamask wallet go <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask#polygon-scan">here</a></div>
                            <div className="menuContentPageRow">To use the app on mobile be sure you are using a Web3 enabled browser (ex. Metamask Mobile App).</div>
                            <div className="menuContentPageRow">Any questions please reach out to <a href="mailto:BigBilly@billynft.com">BigBilly@billynft.com</a></div>
                            <div className="menuContentPageRow">Background color:
                                <div id="backgroundColorInputWrapper" style={{backgroundColor: backgroundColor}}>
                                    <input id="backgroundColorInput" type="color" value={backgroundColor} onClick={(e)=>{e.stopPropagation();}} onChange={(e)=>{
                                        setBackgroundColor(e.target.value);
                                        setBackgroundColorEvent(e.target.value);
                                    }}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function showInfo() {
        setDisplayInfoAddress(walletAddress);
        activateInfoDisplay();
    }

    // function

    const ContractButtons = (props) => {
        var walletAddress = props.props.walletAddress;

        useEffect(()=>{
            //setup menu buttons
            var menuButtons = document.getElementsByClassName("contractButton");
            for (var i = 0; i < menuButtons.length; i++) {
                menuButtons[i].addEventListener('click', function(e) {
                    setBlockViewer(BlockViewer({address:walletAddress, startSize: secondZoom, currentPixelMap: stateGlobalPixelMap}));
                });
                menuButtons[i].addEventListener('touchstart', function(e) {
                    setBlockViewer(BlockViewer({address:walletAddress, startSize: secondZoom, currentPixelMap: stateGlobalPixelMap}));
                });
                if (i===0) {
                    menuButtons[i].addEventListener('click', function(e) {
                        setDisplayInfoAddress(walletAddress);
                        activateInfoDisplay();
                    });

                    menuButtons[i].addEventListener('touchstart', function(e) {
                        setDisplayInfoAddress(walletAddress);
                        activateInfoDisplay();
                    });
                } else if(i===1) {
                    menuButtons[i].addEventListener('click', function(e) {
                        activateEditDisplay();
                    });

                    menuButtons[i].addEventListener('touchstart', function(e) {
                        activateEditDisplay();
                    });
                } else if(i===2) {
                    menuButtons[i].addEventListener('click', function(e) {
                        activateTransferDisplay();
                    });

                    menuButtons[i].addEventListener('touchstart', function(e) {
                        activateTransferDisplay();
                    });
                } else if(i===3) {
                    menuButtons[i].addEventListener('click', function(e) {
                        activateMintDisplay();
                    });

                    menuButtons[i].addEventListener('touchstart', function(e) {
                        activateMintDisplay();
                    });
                }

            }
        }, []);


        return (
            walletAddress.length > 0 ? (
                <div id="contractControllerContainer">
                    <div className="contractButton">
                        <img className="menuImg" src={find}></img>
                        Find
                    </div>
                    <div className="contractButton">
                        <img className="menuImg" src={edit}></img>
                        Edit
                    </div>
                    <div id="homeContractButton" onClick={showMainPixelMap}>
                        <img className="menuImg" src={home}></img>
                        Home
                    </div>
                    <div className="contractButton">
                        <img className="menuImg" src={transfer}></img>
                        Transfer
                    </div>
                    <div className="contractButton">
                        <img className="menuImg" src={mint}></img>
                        Mint
                    </div>
                </div>
            ) : (
                <div id="contractControllerContainer">
                    <div id="homeContractButton" onClick={showMainPixelMap}>
                        <img className="menuImg" src={home}></img>
                        Home
                    </div>
                </div>
            )
        );
    }

    function closePopUpWidget() {
        document.getElementById("popUpContainer").style.display = "none";
    }

    function displayPopUpMessage(message) {
        document.getElementById("popUpMessageContent").innerHTML = message;

        // var confirmButton = document.getElementById("confirmButton");
        // confirmButton.style.display = "none";

        document.getElementById("popUpContainer").style.display = "flex";
    }

    function displayPopUpRefreshMessage(message) {
        document.getElementById("popUpRefreshMessageContent").innerHTML = message;

        // var confirmButton = document.getElementById("confirmButton");
        // confirmButton.style.display = "none";

        document.getElementById("popUpRefreshContainer").style.display = "flex";
    }

    function showLoading() {
        document.getElementById("loadingContainer").style.display = "flex";
    }

    function closeLoading() {
        document.getElementById("loadingContainer").style.display = "none";
    }

    //the UI of our component
    return (
        <div id="container" style={{height: containerHeight}}>
            <div
                id="pixelMapContainer"
            >
                {pixelMap}
            </div>

            <div id="blockViewerContainer">
                {blockViewer}
                <div id="displayContainer">
                    <Info props={{}} />
                    <Transfer props={{}} />
                    <Edit props={{}} />
                    <Mint props={{}} />
                </div>
            </div>
            <div id="controllerContainer">
                <div id="titleHeader">
                    <img id="logo" src={logo}></img>
                    <div id="titleHeaderInfo">
                        <div id="titleHeaderInfoAmount">
                            Total amount minted:
                            <div className="titleHeaderInfoAmountValue">{amountMinted}</div>
                        </div>
                        <div id="titleHeaderInfoAmount">
                            <div id="titleHeaderInfoAmount">
                                Price:
                                <div className="titleHeaderInfoAmountValue">1 GWEI</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="menuButton" onClick={showMenu}>
                    <img className="menuImg" src={menu}></img>
                    Menu
                </div>
                {walletAddress.length > 0 ? (
                    <div id="walletButton" onClick={connectWalletPressed}>
                        <img id="walletImg" src={wallet}></img>
                        <div>
                            {String(walletAddress).substring(38)}
                        </div>
                    </div>
                ) : (
                    <div id="walletButtonNone" onClick={connectWalletPressed}>
                        <img id="walletImg" src={wallet}></img>
                        <div>None</div>
                    </div>
                )}
                <ContractButtons props={{walletAddress: walletAddress}} />
            </div>
            <Menu props={{}}/>
            <div id="popUpContainer" onClick={closePopUpWidget}>
                <div id="popUpMessageContainer">
                    <div id="popUpMessageContent">Lorem Ipsum</div>
                    <div id="popUpButtonContainer">
                        <div id="popUpButtonClose" onClick={closePopUpWidget}>Close</div>
                    </div>
                </div>
            </div>
            <div id="popUpRefreshContainer" onClick={() => window.location.reload(true)}>
                <div id="popUpRefreshMessageContainer">
                    <div id="popUpRefreshMessageContent">Lorem Ipsum</div>
                    <div id="popUpRefreshButtonContainer">
                        <div id="popUpRefreshButton" onClick={() => window.location.reload(true)}>Return Home</div>
                    </div>
                </div>
            </div>
            <div id="loadingContainer" onClick={closeLoading}>
                <div id="helixContainer" className="cssload-wrap">
                    <div className="cssload-container">
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                        <span className="cssload-dots"></span>
                    </div>
                    <div id="loadingButtonContainer">
                        loading...
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BDNFT;
