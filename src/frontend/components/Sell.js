import { useState } from 'react';
import { listNFT, cancelNFT } from "./Interact";
import * as Scroll from 'react-scroll';

const Sell = ({ accounts, setAccounts }) => {

    const [address, setAddress] = useState(""); // string that stores the NFT's address
    const [ID, setID] = useState(""); //string that stores the description
    const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI

    const isConnected = Boolean(accounts[0]); 

    const onListPressed = async () => { //transfer to escrow or marketplace?
        const { status } = await listNFT(ID);
        setStatus(status);
    };

    const onCancelPressed = async () => { //transfer to escrow or marketplace?
      const { status } = await cancelNFT();
      setStatus(status);
  };

    return (
<div class="container">
<h2>Physical NFT</h2>
<p><br></br><br></br>Sell your very own Phyigital BeeToken!</p>
<div class="row">
  <div class="col-sm">
    
    <p><br></br><br></br>Please fill in your NFT's ID. Then press "List/Sell."<br></br></p>
  <form>
    <h5> ID: </h5>
      <input type="number" placeholder="numero uno" onChange={(event) => setID(event.target.value)}/>
  </form>
    <br></br>
<div>
  {isConnected ? (
  <button id="mintButton" onClick={onListPressed}>
  Sell NFT <br></br>
  </button>
  ) : (
  <p>Your wallet is not connected! You cannot sell.</p>
  )}
  <p id="status"> {status} </p>
  <p>implement future "feedback"</p>
</div>
  <p> <br></br> Do you wish to reverse your Listing? <br></br> </p>
  <button id="mintButton" onClick={onCancelPressed}> Cancel NFT Listing <br></br>
  </button>
</div>
<div class="col-sm">
  <p> <br></br> <br></br> <br></br> need to get scrolling working before implementing anymore functions :D</p>
  <p> <br></br> Do you wish to cancel before delivery? <br></br> </p>
  <button id="mintButton" onClick={onCancelPressed}>Cancel purchase before delivery<br></br>
  </button>
  <p> <br></br> Are you ready to send your Phygital to the Buyer? <br></br> </p>
  <button id="mintButton" onClick={''}>
    Initiate Delivery <br></br>
  </button>
  <p><br></br>It would be neat to somehow see the current status @ the moment (nice2have)
  </p>
</div>
</div>
</div>
    );
}

export default Sell;
