// Importing React hook 'useState'
import { useState } from "react";
// Importing helper functions from 'Interact.js'
import {
  buyNFT,
  cancelNFTSaleBeforeDelivery,
  confirmNFTDelivery,
  loadItemState,
} from "./Interact";

const Buy = ({ accounts }) => {
  const [ID, setID] = useState(""); // string that stores the id
  const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI
  const [price, setPrice] = useState(""); // price storage
  const [tokenId, setTokenId] = useState(""); // string that stores the token ID
  const [itemState, setItemState] = useState(null); // Initializing the item state to null

  const isConnected = Boolean(accounts[0]); // Boolean value that determines if a wallet is connected to the app

  // Async function that handles the buy NFT action
  const onBuyPressed = async () => {
    // Calling the buyNFT function from 'Interact.js' with ID and price
    const { status } = await buyNFT(ID, price);
    setStatus(status); // Updating the status message
  };

  // Async function that handles the cancel purchase before delivery action
  const onCancelPressed = async () => {
    // Calling the cancelNFTSaleBeforeDelivery function from 'Interact.js' with ID
    const { status } = await cancelNFTSaleBeforeDelivery(ID);
    // Updating the status message
    setStatus(status);
  };

  // Async function that handles the confirm delivery action
  const onConfirmPressed = async () => {
    // Calling the confirmNFTDelivery function from 'Interact.js' with ID
    const { status } = await confirmNFTDelivery(ID, {gasLimit: 300000});
    // Updating the status message
    setStatus(status);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Calling the loadItemState function from 'Interact.js' with tokenId
    const state = await loadItemState(tokenId);
    // Updating the item state
    setItemState(state);
  };

  return (
    <div class="container">
      <h4>Buy a very special Phygital BeeToken!</h4>
      <br></br>
      <div class="row">
        <div class="col-sm">
          <div class="element">
            <p>
              <br></br>Please fill in the ID and Price of the BeeToken you wish
              to purchase.<br></br>
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
                <button id="pressButton" onClick={onBuyPressed}>
                  Buy NFT <br></br>
                </button>
              ) : (
                <p className="small">
                  Your wallet is not connected! You cannot buy.
                </p>
              )}
              <p id="status"> {status} </p>
            </div>
          </div>
          <div class="element">
            <p>
              {" "}
              <br></br> <br></br> Has the physical Item arrived & are you
              satisfied? <br></br>
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
            {isConnected ? (
              <button id="pressButton" onClick={onConfirmPressed}>
                Confirm Delivery <br></br>
              </button>
            ) : (
              <p className="small">
                Your wallet is not connected! You cannot confirm delivery.
              </p>
            )}
          </div>
        </div>
        <div class="col-sm">
          <div class="element">
            <p>
              {" "}
              <br></br> Do you wish to cancel the purchase before delivery?{" "}
              <br></br>
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
            {isConnected ? (
              <button id="pressButton" onClick={onCancelPressed}>
                Cancel purchase before delivery<br></br>
              </button>
            ) : (
              <p className="small">
                Your wallet is not connected! You cannot cancel the purchase.
              </p>
            )}
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
            <button id="pressButton" onClick={handleSubmit}>
              Check State
            </button>
            <p>
              <br></br>The state of BeeToken {tokenId} is: {itemState}!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
