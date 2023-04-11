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
      <div class="container">
          <h3>Mint your very own Phygital BeeToken!</h3>
          <br></br>
          <div class="row">
            <div class="col-sm">
              <div class="element2"> 
                <p>Please fill out your asset's name and description. <br></br>Then press "Mint."
                  <br></br>
                </p>
                <div className="input-container">
                  <label htmlFor="id">Name of Phygital BeeToken:</label>
                  <input type="text" id="name" placeholder="Enter Name" onChange={(event) => setName(event.target.value)} className="input-style"/>
                </div>
                <div className="input-container">
                  <label htmlFor="price">Description:</label>
                  <textarea id="description" rows="4" cols="50" placeholder="Describe your Physical Asset."onChange={(event) => setDescription(event.target.value)} className="input-style2"></textarea>
                </div>
                <div className="input-container">
                  <label htmlFor="price">Image of Physical Asset:</label>
                  <input type="image" id="description" onChange={(event) => setImage(event.target.value)} className="input-style"/>
                </div>
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
            </div>
          </div>
        </div>
    );
};

export default Mint;
