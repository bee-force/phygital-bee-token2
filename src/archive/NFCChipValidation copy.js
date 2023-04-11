import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import physicalNFT from '../contractsData/BeeToken.json';

const NFCChipValidation = ({}) => {
  const [userAddress, setUserAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenIds, setTokenIds] = useState([]);
  const [balance, setBalance] = useState('');
  const [metadata, setMetadata] = useState([]);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Get the token address and create a contract instance
    const tokenAddress = '0x944A8Ae87be2e8b134002D26139c7a888aFd38F6';
    setTokenAddress(tokenAddress);
    const tokenContract = new ethers.Contract(tokenAddress, physicalNFT.abi, signer);

    async function getTokenBalance() {
      try {
        // Prompt user to connect to MetaMask
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts:', accounts);
            const address = accounts[0];

            // Get the token IDs for the user
            const tokenIds = await tokenContract.balanceOf(address);
            setTokenIds(Array.from({ length: Number(tokenIds) }, (v, k) => k));
          } catch (error) {
            console.error('Error requesting accounts:', error);
          }
        } else {
          console.error('No ethereum provider detected');
        }

        // Get the user's address from MetaMask
        const address = await signer.getAddress();
        setUserAddress(address);

        // Get the token balance for the user
        const balance = await tokenContract.balanceOf(address);
        setBalance(balance.toString());
      } catch (error) {
        console.log(error);
      }
    }

    const getMetadata = async (tokenId) => {
      try {
        const tokenURI = await tokenContract.tokenURI(tokenId);
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        setMetadata((prevMetadata) => [...prevMetadata, metadata]);
      } catch (error) {
        console.log(error);
      }
    };

    getTokenBalance();
    tokenIds.forEach((id) => getMetadata(id));

  }, []);

  return (
    <div className="container">
      <h2>Physical NFT</h2>
      <p><br /><br />Verify your NFC Chip - this could be similar to the homepage but only presenting one token!</p>
      <h1>Token balance</h1>
      <p>User address: {userAddress}</p>
      <p>Token address: {tokenAddress}</p>
      <p>Token balance: {balance}</p>
      <div>
        {metadata.map((m, i) => (
          <div key={i}>
            <h3>Token {i + 1} metadata</h3>
            <p>Metadata ID: {m.tokenId}</p>
            <p>Metadata name: {m.name}</p>
            <p>Metadata description: {m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFCChipValidation;
