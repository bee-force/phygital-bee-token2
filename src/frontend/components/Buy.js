import { useState } from 'react';
import { buyNFT, cancelNFTSale } from "./Interact";


/*   <h5> <br></br> Address: </h5>
      <input type="text" placeholder="e.g. 28394757023402307" onChange={(event) => setAddress(event.target.value)}/> */
const Buy = ({ accounts, setAccounts }) => {

    const [address, setAddress] = useState(""); // string that stores the NFT's address
    const [ID, setID] = useState(""); //string that stores the description
    const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI
    const [price, setPrice] = useState("");

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

    return (
<div class="container">
<h2>Physical NFT</h2>
<p><br></br><br></br>Sell your very own Phyigital BeeToken!</p>
<div class="row">
  <div class="col-sm">
    <p><br></br>Please fill in the NFT's ID & address you would like to buy</p>
  <form>
    <h5> ID: </h5>
      <input type="number" placeholder="numero uno" onChange={(event) => setID(event.target.value)}/>
    <h5> <br></br> Price: </h5>
      <input type="number" placeholder="numero uno" onChange={(event) => setPrice(event.target.value)}/>
  </form>
    <br></br>
<div>
  {isConnected ? (
  <button id="buyButton" onClick={onBuyPressed}>
  Buy NFT <br></br>
  </button>
  ) : (
  <p>Your wallet is not connected! You cannot sell.</p>
  )}
  <p id="status"> {status} </p>
</div>
</div>
<div class="col-sm">
<p> <br></br> Do you wish to cancel the purchase before delivery? <br></br> </p>
<form>
    <h5> ID: </h5>
      <input type="number" placeholder="numero uno" onChange={(event) => setID(event.target.value)}/>
  </form>
  <br></br>
  <button id="mintButton" onClick={onCancelPressed}>Cancel purchase before delivery<br></br>
  </button>
  <p> <br></br> <br></br> Has you delivery arrived? <br></br> </p>
  <button id="mintButton" onClick={onConfirmPressed}>
    Confirm Delivery <br></br>
  </button>
  <p><br></br>It would be neat to somehow see the current status @ the moment (nice2have)
  </p>
</div>
</div>
</div>
    );
}

export default Buy;