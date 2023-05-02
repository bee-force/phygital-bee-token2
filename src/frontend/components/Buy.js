import { useState } from 'react';
import { ethers } from "ethers";
import { buyNFT, cancelNFTSale, confirmNFTDelivery } from "./Interact";

import phygitalEscrowJson from '../contractsData/remakePhygitalEscrow3.json'

const phygitalEscrowAddress = process.env.REACT_APP_ESCROW_ADDRESS;

/*   <h5> <br></br> Address: </h5>
      <input type="text" placeholder="e.g. 28394757023402307" onChange={(event) => setAddress(event.target.value)}/> */
const Buy = ({ accounts, setAccounts }) => {

    const [ID, setID] = useState(""); //string that stores the description
    const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI
    const [price, setPrice] = useState("");
    const [tokenId, setTokenId] = useState('');
    const [itemState, setItemState] = useState(null);

    const isConnected = Boolean(accounts[0]); 

    const onBuyPressed = async () => { //transfer to escrow or marketplace?
        const { status } = await buyNFT(ID, price);
        setStatus(status);
    };

    const onCancelPressed = async () => { //transfer to escrow or marketplace?
      const { status } = await cancelNFTSale(ID);
      setStatus(status);
  };

  const onConfirmPressed = async () => { //transfer to escrow or marketplace?
    const { status } = await confirmNFTDelivery(ID);
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
      const listedNFT = new ethers.Contract(phygitalEscrowAddress, phygitalEscrowJson.abi, signer);
    
      //const item = await listedNFT.items(tokenId);
      const itemCount = await listedNFT.itemCount()
      for (let i = 1; i <= itemCount; i++) {
        const item = await listedNFT.items(i)
        if (item.tokenId == tokenId) { 
          console.log(item.state);
          console.log(item.sold)
      return item.state;
      }
    }  
};
    


    return (
<div class="container">
<h4>Buy a very special Phygital BeeToken!</h4>
<br></br>
<div class="row">
    <div class="col-sm">
    <div class="element">
  <p><br></br>Please fill in the ID and Price of the BeeToken you wish to purchase.<br></br><br></br></p>
  <div className="input-container">
  <label htmlFor="id">TokenID:</label>
  <input type="number" id="id" placeholder="Enter ID" onChange={(event) => setID(event.target.value)} className="input-style"/>
</div>
<div className="input-container">
  <label htmlFor="price">Price:</label>
  <input type="number" id="price" placeholder="Enter Price" onChange={(event) => setPrice(event.target.value)} className="input-style"/>
</div>
<div>
  {isConnected ? (
  <button id="mintButton" onClick={onBuyPressed}>
  Buy NFT <br></br>
  </button>
  ) : (
  <p>Your wallet is not connected! You cannot buy.</p>
  )}
  <p id="status"> {status} </p>
</div>
</div>
<div class="element"> 
  <p> <br></br> <br></br> Has the physical Item arrived & are you satisfied? <br></br><br></br> </p>
  <div className="input-container">
  <label htmlFor="id">TokenID:</label>
  <input type="number" id="id" placeholder="Enter ID" onChange={(event) => setID(event.target.value)} className="input-style"/>
</div>
  <button id="mintButton" onClick={onConfirmPressed}>
    Confirm Delivery <br></br>
  </button>
  </div>   
</div>
<div class="col-sm">
<div class="element">
<p> <br></br> Do you wish to cancel the purchase before delivery? <br></br><br></br></p>
<div className="input-container">
  <label htmlFor="id">TokenID:</label>
  <input type="number" id="id" placeholder="Enter ID" onChange={(event) => setID(event.target.value)} className="input-style"/>
</div>
  <button id="mintButton" onClick={onCancelPressed}>Cancel purchase before delivery<br></br>
  </button>
</div>
<div className="element_state">
<br></br><h6>BeeToken Status</h6><br></br>
  <div className="input-container">
    <label htmlFor="id">Token ID:</label>
    <input type="number" id="id" placeholder="Enter ID" onChange={(event) => setTokenId(event.target.value)} className="input-style"/>
    </div>
    <button id="mintButton" onClick={handleSubmit}>Check State</button>
  <p><br></br>The state of BeeToken {tokenId} is: {itemState}</p>
</div>
</div>
</div>
</div>
    );
}

export default Buy;