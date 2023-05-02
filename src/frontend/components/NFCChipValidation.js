import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import physicalNFT from "../contractsData/BeeToken.json";

const NFCChipValidation = ({ accounts }) => {

  const [tokenAddress, setTokenAddress] = useState("");
  const [metadata, setMetadata] = useState("");
  const isConnected = Boolean(accounts[0]);
  const [tokenId, setTokenId] = useState("");

  useEffect(() => {
    // Get the token address --> transfer this to the .env File! 
    const tokenAddress = "0x944A8Ae87be2e8b134002D26139c7a888aFd38F6";
    setTokenAddress(tokenAddress);
    
    // Get the user's address from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create a contract instance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      physicalNFT.abi,
      signer
    );

    // Get the metadata for the token
    const getMetadata = async () => {
      const tokenURI = await tokenContract.tokenURI(tokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      setMetadata(metadata);
    };

    if (tokenId !== "") {
      getMetadata();
    }
  }, [tokenId]);

  const handleInputChange = (event) => {
    setTokenId(event.target.value);
  };

  return (
    <div className="container">
      <h1>Phygital</h1>
      <p>
        <br />
        <br />
        Check the NFC Chip of your Phygital!
      </p>
      {isConnected ? (
        <React.Fragment>
          <h5>
            Phygital Info:
            <br />
            <br />
          </h5>
          <input
            type="text"
            placeholder="Enter token ID"
            value={tokenId}
            onChange={handleInputChange}
            className="input-style3"
          />

          {tokenId !== "" && metadata.name && (
            <div class="element">
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
                  <img src={metadata.image} alt="Phygital Image" style={{ maxWidth: "25%"}} />
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

export default NFCChipValidation;
