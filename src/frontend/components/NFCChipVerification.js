// Importing the ethers library for Ethereum interaction
import { ethers } from "ethers"; 
// Importing React and useState hook
import React, { useState } from "react"; 
// Importing the BeeToken contract ABI
import phygitalBeeToken from "../contractsData/beeToken.json"; 
// Storing the BeeToken contract address
// const beeTokenAddress = process.env.REACT_APP_BEE_TOKEN_ADDRESS; 
const beeTokenAddress = '0x5d73B90BE815e3DaB76436bc1ff268Da382FCC2e'

const NFCChipVerification = ({ accounts }) => {
  // State variable to store the metadata of the Phygital BeeToken
  const [metadata, setMetadata] = useState(null);
  // State variable to store the input token ID
  const [tokenId, setTokenId] = useState(""); 
  // State variable to track loading status
  const [isLoading, setIsLoading] = useState(false); 
   // Checking if the wallet is connected 
   const isConnected = Boolean(accounts[0]); 

  const authenticatePhygital = async () => {
    // Checking if the token ID is not empty
    if (tokenId !== "") { 
      // Setting loading status to true
      setIsLoading(true); 
      // Fetching the metadata for the given token ID
      const metadata = await getMetadata(tokenId); 
      // Updating the metadata state variable
      setMetadata(metadata); 
      // Setting loading status to false - so the "is loading" message won't pop up anymore
      setIsLoading(false); 
    }
  };

  const handleInputChange = (event) => {
    // Updating the token ID state variable based on user input
    setTokenId(event.target.value); 
    // Resetting the metadata state variable
    setMetadata(null); 
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      // Authenticating Phygital BeeToken on pressing the Enter key
      authenticatePhygital(); 
    }
  };

  const getMetadata = async (tokenId) => {
    // Get the user's address from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create a contract instance
    const tokenContract = new ethers.Contract(
      beeTokenAddress,
      phygitalBeeToken.abi,
      signer
    );
    
    // Fetching the token URI for the given token ID
    const tokenURI = await tokenContract.tokenURI(tokenId); 
    // Fetching the metadata JSON file
    const response = await fetch(tokenURI); 
    // Parsing the metadata as JSON
    const metadata = await response.json(); 
    // Returning the metadata
    return metadata; 
  };

  /*React.Fragment is a built-in component that allows you to group multiple elements without adding an additional DOM element. 
  It's also sometimes referred to as a "fragment" or "empty tag." When rendering JSX in React, you typically need to wrap adjacent 
  JSX elements within a single parent element. However, there are cases where you don't want to introduce an additional DOM element 
  just for the purpose of wrapping the elements. This is where React.Fragment comes in. Instead of using a regular HTML element 
  like <div> or <span> as the parent wrapper, you can use <React.Fragment> (or the shorthand syntax <>) to group multiple elements. 
  It acts as an invisible wrapper that doesn't generate any extra DOM nodes. */

  return (
    <div className="container">
      <h3>Phygital BeeToken Verification</h3>
      {isConnected ? (
        <React.Fragment>
          <br />
          <div className="element">
            <h6>
              Phygital Info:
              <br />
            </h6>
            <input
              type="text"
              placeholder="Enter Token ID"
              value={tokenId}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              className="input-style3"
            />
            <br />
            <button onClick={authenticatePhygital} id="pressButton">
              Verify Phygital BeeToken
            </button>
          </div>

          {isLoading && <p>Loading metadata...</p>}

          {metadata && metadata.name && (
            <div className="element">
              <>
                <h7>
                  <br />
                  <br />
                  Name: {metadata.name}
                </h7>
                <p>
                  <br />
                  <br />
                  Description: {metadata.description}
                </p>
                <p>
                  <br />
                  <br />
                  <img
                    src={metadata.image}
                    alt="Phygital"
                    style={{ maxWidth: "25%" }}
                  />
                </p>
              </>
            </div>
          )}
        </React.Fragment>
      ) : (
        <p>Your wallet is not connected! You need to be connected! </p>
      )}
    </div>
  );
};

export default NFCChipVerification;
