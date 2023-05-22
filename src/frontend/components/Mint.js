// Importing the useState hook from the React library
import { useState } from "react"; 
// Importing the mintNFT function from the "Interact" module
import { mintNFT } from "./Interact";
// Importing the CSS file for the "App" component 
import "./App.css"; 

// Declaring a functional component named "Mint" that accepts the "accounts" prop
const Mint = ({ accounts }) => { 
  // Declaring a state variable "name" using the useState hook, initialized to an empty string
  const [name, setName] = useState(""); 
  // Declaring a state variable "description" using the useState hook, initialized to an empty string
  const [description, setDescription] = useState(""); 
  // Declaring a state variable "image" using the useState hook, initialized to an empty string
  const [image, setImage] = useState(""); 
  // Declaring a state variable "status" using the useState hook, initialized to an empty string
  const [status, setStatus] = useState(""); 
// Checking if the "accounts" prop has a truthy value at index 0 and assigning the result to the "isConnected" variable
  const isConnected = Boolean(accounts[0]); 

  // Declaring an asynchronous function named "onMintPressed"
  const onMintPressed = async () => { 
    // Fetching the image URL, converting it to a Blob, and assigning it to the "imageBlob" variable
    const imageBlob = await fetch(image).then((r) => r.blob()); 
    const { status } = await mintNFT(name, description, imageBlob); // Minting an NFT using the "mintNFT" function with the provided name, description, and imageBlob, and assigning the returned status to the "status" variable
    setStatus(status); // Updating the "status" state variable with the minting status
  };

  return (
    <div class="container">
      <h3>Tokenize your physical asset by minting your individual BeeToken!</h3>
      <br></br>
      <div class="row">
        <div class="col-sm">
          <div class="element2">
            <p>
              Please fill out your asset's name and description. <br></br>Then
              press "Mint."
              <br></br>
            </p>
            <div className="input-container">
              <label htmlFor="id">Name of Phygital BeeToken:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                onChange={(event) => setName(event.target.value)}
                className="input-style"
              />
            </div>
            <div className="input-container">
              <label htmlFor="price">Description:</label>
              <textarea
                id="description"
                rows="4"
                cols="50"
                placeholder="Describe your Physical Asset."
                onChange={(event) => setDescription(event.target.value)}
                className="input-style2"
              ></textarea>
            </div>
            <div className="input-container">
              <label htmlFor="price">Image of Physical Asset:</label>
              <input
                type="file"
                id="image"
                onChange={(event) =>
                  setImage(URL.createObjectURL(event.target.files[0]))
                }
                className="input-style"
              />
            </div>
            <div>
              {isConnected ? (
                <button id="pressButton" onClick={onMintPressed}>
                  Mint NFT
                </button>
              ) : (
                <p>Your wallet is not connected! You cannot mint.</p>
              )}
              <p id="status">{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
