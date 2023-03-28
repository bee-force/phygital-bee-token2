import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import physicalNFT from '../contractsData/BeeToken.json'

const NFCChipValidation = ({accounts}) => {

  const [userAddress, setUserAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [metadata, setMetadata] = useState('');
  const isConnected = Boolean(accounts[0]); 
  const [tokenId, setTokenId] = useState('');
    
  useEffect(() => {

    // Get the token address 
    const tokenAddress = '0x944A8Ae87be2e8b134002D26139c7a888aFd38F6';
    setTokenAddress(tokenAddress);

    // Get the user's address from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    async function getAddress() {
      const address = await signer.getAddress();
      setUserAddress(address);
    }
    getAddress();

    // Create a contract instance
    const tokenContract = new ethers.Contract(tokenAddress, physicalNFT.abi, signer);

    async function getTokenBalance() {
      try {
        // Prompt user to connect to MetaMask
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts:', accounts);
            // Use accounts in your DApp
          } catch (error) {
            console.error('Error requesting accounts:', error);
          }
        } else {
          console.error('No ethereum provider detected');
        }
    
        // Get the token balance for the user
        const balance = await tokenContract.balanceOf(userAddress);

        setBalance(balance.toString());
      } catch (error) {
        console.log(error);
      }
    }

    // Get the metadata for the token
    const getMetadata = async () => {
      const tokenURI = await tokenContract.tokenURI(tokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      setMetadata(metadata);
    }     

    getTokenBalance();
        
    if (tokenId !== '') {
      getMetadata();
    }
      
  }, [tokenId, userAddress]);

  const handleInputChange = (event) => {
    setTokenId(event.target.value);
  }
    
    
      return (
        <div className="container">
          <h1>Phygital</h1>
          <p><br/><br/>Check the NFC Chip of your Phygital!</p>   
          {isConnected ? (
            <React.Fragment>
              <h5>Phygital Info:<br/><br/></h5>
              <input type="text" placeholder="Enter token ID" value={tokenId} onChange={handleInputChange} />
        {tokenId !== '' && metadata.name && (
          <>
            <p><br/><br/>Metadata name: {metadata.name}</p>
            <p><br/><br/>Metadata description: {metadata.description}</p> 
            <p><br/><br/>Function that will enforce action in Escrow Contract?</p>
          </>
        )}
            </React.Fragment>
          ):( 
            <p>Your wallet is not connected! You need to be connected! </p> 
          )}
        </div>
      );
   }
    
export default NFCChipValidation;
