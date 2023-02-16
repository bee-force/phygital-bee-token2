import { useState } from 'react';
import { listNFT } from "./Interact";

const SellBuy = ({ accounts, setAccounts }) => {

    const [address, setAddress] = useState(""); // string that stores the NFT's address
    const [ID, setID] = useState(""); //string that stores the description
    const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI

    const isConnected = Boolean(accounts[0]); 

    const onListPressed = async () => { //transfer to escrow or marketplace?
        const { status } = await listNFT(ID);
        setStatus(status);
    };

    return (
        <div>
      <h2>Physical NFT</h2>
      <p><br></br>Sell your very own Phyiscal NFT!</p>

      <p><br></br>make 2 pages out of this?</p>
    <p>
      Please fill in your NFT's ID.  <br></br>  <br></br> Then press "List/Sell."
      <br></br>
    </p>
    <form>
      <h5> <br></br>ID: </h5>
      <input
        type="number"
        placeholder="numero uno"
        onChange={(event) => setID(event.target.value)}
      />
    </form>
    <br></br>
    <div>
    {isConnected ? (
    <button id="mintButton" onClick={onListPressed}>
      Sell NFT
    </button>
    ) : (
      <p>Your wallet is not connected! You cannot sell.</p>
    )}
    <p id="status">
      {status}
    </p>

    <p>implement future "feedback"</p>
  </div>
  </div>
    
        
    );
}

export default SellBuy;
