// Importing React hook 'useState' and Ethereum library
import { useState } from "react";

// Importing helper functions from 'Interact.js'
import {
  listNFT,
  cancelNFTListing,
  cancelNFTSaleBeforeDelivery,
  initiateDelivery,
  loadItemState,
} from "./Interact";

const Sell = ({ accounts }) => {
  const [ID, setID] = useState(""); //string that stores the description
  const [price, setPrice] = useState(""); // price storage
  const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI
  const [tokenId, setTokenId] = useState(""); // string that stores the token ID
  const [itemState, setItemState] = useState(null); // Initializing the item state to null
  // Boolean value that determines if a wallet is connected to the app
  const isConnected = Boolean(accounts[0]);

  // Async function that lists a NFT on the phygital escrow marketplace
  const onListPressed = async () => {
    const { status } = await listNFT(ID, price);
    setStatus(status);
  };

  // Async function that cancels a NFT listing on the phygital escrow marketplace
  const onCancelListingPressed = async () => {
    const { status } = await cancelNFTListing(ID);
    setStatus(status);
  };

  // Async function that cancels a NFT sale before delivery on the phygital escrow marketplace
  const onCancelDeliveryPressed = async () => {
    const { status } = await cancelNFTSaleBeforeDelivery(ID);
    setStatus(status);
  };

  // Async function that initiates the delivery of a NFT to the buyer on the phygital escrow marketplace
  const onDeliveryPressed = async () => {
    const { status } = await initiateDelivery(ID);
    setStatus(status);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const state = await loadItemState(tokenId);
    setItemState(state);
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
                <button
                  id="pressButton"
                  onClick={onListPressed}
                >
                  Sell Phygital BeeToken <br></br>
                </button>
              ) : (
                <p className="small">
                  Your wallet is not connected! You cannot sell.
                </p>
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
            {isConnected ? (
              <button
                id="pressButton"
                onClick={onDeliveryPressed}
              >
                Initiate delivery <br></br>
              </button>
            ) : (
              <p className="small">
                Your wallet is not connected! You cannot initiate delivery.
              </p>
            )}
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
            {isConnected ? (
              <button
                id="pressButton"
                onClick={onCancelListingPressed}
              >
                {" "}
                Cancel NFT Listing <br></br>
              </button>
            ) : (
              <p className="small">
                Your wallet is not connected! You cannot cancel your listing.
              </p>
            )}
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
            {isConnected ? (
              <button
                id="pressButton"
                onClick={onCancelDeliveryPressed}
              >
                Cancel sale before delivery<br></br>
              </button>
            ) : (
              <p className="small">
                Your wallet is not connected! You cannot cancel the sale.
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
            <button
              id="pressButton"
              onClick={handleSubmit}
            >
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
