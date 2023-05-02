import { useState } from "react";
import { ethers } from "ethers";
import {
  listNFT,
  cancelNFT,
  cancelNFTSale,
  initiateDelivery,
} from "./Interact";

import phygitalEscrowJson from "../contractsData/remakePhygitalEscrow3.json";

const phygitalEscrowAddress = process.env.REACT_APP_ESCROW_ADDRESS;

const Sell = ({ accounts, setAccounts }) => {
  const [ID, setID] = useState(""); //string that stores the description
  const [price, setPrice] = useState(""); // price storage
  const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI
  const [tokenId, setTokenId] = useState("");
  const [itemState, setItemState] = useState(null);

  const isConnected = Boolean(accounts[0]);

  const onListPressed = async () => {
    //transfer to escrow or marketplace?
    const { status } = await listNFT(ID, price);
    setStatus(status);
  };

  const onCancelPressed = async () => {
    //transfer to escrow or marketplace?
    const { status } = await cancelNFT(ID);
    setStatus(status);
  };

  const onCancelPressed2 = async () => {
    //transfer to escrow or marketplace?
    const { status } = await cancelNFTSale(ID);
    setStatus(status);
  };

  const onDeliveryPressed = async () => {
    //transfer to escrow or marketplace?
    const { status } = await initiateDelivery(ID);
    setStatus(status);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const state = await loadItemState(tokenId);
    setItemState(state);
  };

  const loadItemState = async (tokenId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //const nft = new ethers.Contract(beeTokenAddress, physicalNFT.abi, signer);
    const listedNFT = new ethers.Contract(
      phygitalEscrowAddress,
      phygitalEscrowJson.abi,
      signer
    );

    //const item = await listedNFT.items(tokenId);
    const itemCount = await listedNFT.itemCount();
    for (let i = 1; i <= itemCount; i++) {
      const item = await listedNFT.items(i);
      if (item.tokenId == tokenId) {
        console.log(item.tokenId);
        console.log(item.state);
        console.log(item.sold);
        return item.state;
      }
    }
  };

  return (
    <div class="container">
      <h4>Sell your very own Phygital BeeToken!</h4>
      <br></br>
      <div class="row">
        <div class="col-sm">
          <div class="element">
            <p>
              <br></br>Please fill in the ID and Price of your BeeToken.
              <br></br>
            </p>
            <div className="input-container">
              <label htmlFor="id">TokenID:</label>
              <input
                type="number"
                id="id"
                placeholder="Enter ID"
                onChange={(event) => setID(event.target.value)}
                className="input-style"
              />
            </div>
            <div className="input-container">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                placeholder="Enter Price"
                onChange={(event) => setPrice(event.target.value)}
                className="input-style"
              />
            </div>
            <div>
              {isConnected ? (
                <button id="mintButton" onClick={onListPressed}>
                  Sell Phygital BeeToken <br></br>
                </button>
              ) : (
                <p>Your wallet is not connected! You cannot sell.</p>
              )}
              <p id="status"> {status} </p>
              <p>
                <b>Attention!</b> You will need to confirm a second step in
                MetaMask after pressing Sell Phygital BeeToken.
              </p>
            </div>
          </div>
          <div class="element">
            <p>
              {" "}
              <br></br>Are you ready to send your Phygital to the Buyer?{" "}
              <br></br>{" "}
            </p>
            <div className="input-container">
              <label htmlFor="id">TokenID:</label>
              <input
                type="number"
                id="id"
                placeholder="Enter ID"
                onChange={(event) => setID(event.target.value)}
                className="input-style"
              />
            </div>
            <button id="mintButton" onClick={onDeliveryPressed}>
              Initiate delivery <br></br>
            </button>
          </div>
        </div>
        <div class="col-sm">
          <div class="element">
            <p>
              {" "}
              <br></br> Do you wish to reverse your Listing? <br></br>{" "}
            </p>
            <div className="input-container">
              <label htmlFor="id">TokenID:</label>
              <input
                type="number"
                id="id"
                placeholder="Enter ID"
                onChange={(event) => setID(event.target.value)}
                className="input-style"
              />
            </div>
            <button id="mintButton" onClick={onCancelPressed}>
              {" "}
              Cancel NFT Listing <br></br>
            </button>
          </div>
          <div class="element">
            <p>
              {" "}
              <br></br> Do you wish to cancel before delivery? <br></br>{" "}
            </p>
            <div className="input-container">
              <label htmlFor="id">TokenID:</label>
              <input
                type="number"
                id="id"
                placeholder="Enter ID"
                onChange={(event) => setID(event.target.value)}
                className="input-style"
              />
            </div>
            <button id="mintButton" onClick={onCancelPressed2}>
              Cancel sale before delivery<br></br>
            </button>
          </div>

          <div className="element_state">
            <br></br>
            <h6>BeeToken Status</h6>
            <br></br>
            <div className="input-container">
              <label htmlFor="id">Token ID:</label>
              <input
                type="number"
                id="id"
                placeholder="Enter ID"
                onChange={(event) => setTokenId(event.target.value)}
                className="input-style"
              />
            </div>
            <button id="mintButton" onClick={handleSubmit}>
              Check State
            </button>
            <p>
              <br></br>The state of BeeToken {tokenId} is: {itemState}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
