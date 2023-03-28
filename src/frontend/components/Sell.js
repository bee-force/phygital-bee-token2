import { useState } from 'react';
import { listNFT, cancelNFT, cancelNFTSale } from "./Interact";
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

  const onCancelPressed2 = async () => { //transfer to escrow or marketplace?
    const { status } = await cancelNFTSale(ID);
    setStatus(status);
};

    return (
<div class="container">
<h2>Physical NFT</h2>
<p><br></br>Sell your very own Phygital BeeToken!</p>
<div class="row">
  <div class="col-sm">
    
    <p><br></br>Please fill in your NFT's ID. Then press "List/Sell."<br></br></p>
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
  <p>you will need to confirm a second step (after approving the address, the listing of the nft follows)</p>
</div>
  <p> <br></br> Do you wish to reverse your Listing? <br></br> </p>
  <button id="mintButton" onClick={onCancelPressed}> Cancel NFT Listing <br></br>
  </button>
</div>
<div class="col-sm">
  <p> <br></br> Do you wish to cancel before delivery? <br></br> </p>
  <form>
    <h5> ID: </h5>
      <input type="number" placeholder="numero uno" onChange={(event) => setID(event.target.value)}/>
  </form>
    <br></br>
  <button id="mintButton" onClick={onCancelPressed2}>Cancel sale before delivery<br></br>
  </button>
  <p> <br></br> <br></br> Are you ready to send your Phygital to the Buyer? <br></br> </p>
  <button id="mintButton" onClick={''}>
    Initiate delivery <br></br>
  </button>
  <p><br></br>It would be neat to somehow see the current status @ the moment (nice2have)
  </p>
</div>
</div>
</div>
    );
}

export default Sell;
