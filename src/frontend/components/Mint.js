import { useState } from 'react';
import { mintNFT, mintNFT2, mintNFT3 } from "./Interact";
import './App.css';

const Mint = ({ accounts }) => {

    const [name, setName] = useState(""); // string that stores the NFT's name
    const [description, setDescription] = useState(""); //string that stores the description
    const [image, setImage] = useState("");
    const [status, setStatus] = useState(""); // string that contains the message to display at the bottom of the UI
    
    // const [mintAmount, setMintAmount] = useState(1); // this can be updated with that setMintAmount & starts with 1 
    
    const isConnected = Boolean(accounts[0]); 
    
      const onMintPressed = async () => {
        const { status } = await mintNFT(name, description);
        setStatus(status);
    };
    
    return (
      <div>
      <h2>Physical NFT</h2>
      <p><br></br>Mint your very own Phyiscal NFT!</p>
    <p>
      Please fill out your asset's name and description.  <br></br>  <br></br> Then press "Mint."
      <br></br>
    </p>
    <form>
    <h5> <br></br> Name: </h5>
      <input
        type="text"
        placeholder="e.g. special Vase"
        onChange={(event) => setName(event.target.value)}
      />
      
      <h5> <br></br>Description: </h5>
      <input
        type="text"
        placeholder="what is so awesome about my object"
        onChange={(event) => setDescription(event.target.value)}
      />

      <h5> <br></br>Future Image Upload: </h5>
      <input
        type="image"
        placeholder="picture of my collectible"
        onChange={(event) => setImage(event.target.value)}
      />

    </form>
    <br></br>
    <div>
    {isConnected ? (
    <button id="mintButton" onClick={onMintPressed}>
      Mint NFT
    </button>
    ) : (
      <p>Your wallet is not connected! You cannot mint.</p>
    )}
    <p id="status">
      {status}
    </p>
  </div>
  </div>
    );
  }

export  default Mint;