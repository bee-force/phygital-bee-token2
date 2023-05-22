import { Link } from "react-router-dom";  // Importing the Link component from react-router-dom library
import { Nav, Modal } from "react-bootstrap";  // Importing the Nav, Modal, and Button components from react-bootstrap library
import React, { useState, useEffect } from "react";  // Importing React, useState, and useEffect from the react library
import super_bee from "../assets/super_bee.svg";  // Importing the super_bee image asset

const NavBar = ({ setAccounts }) => {  // Declaring a functional component NavBar with accounts and setAccounts as props
  const [isConnected, setIsConnected] = useState(false);  // Creating a state variable isConnected and initializing it as false
  const [showModal, setShowModal] = useState(false);  // Creating a state variable showModal and initializing it as false

  useEffect(() => {
    // Check if a wallet is already connected
    const checkConnectedWallet = async () => {
      if (window.ethereum) {  // Checking if the window.ethereum object is available
        try {
          // Request accounts from MetaMask
          const accounts = await window.ethereum.request({
            method: "eth_accounts",  // Requesting the connected Ethereum accounts
          });
          if (accounts.length > 0) {  // Checking if there are any connected accounts
            setIsConnected(true);  // Updating the isConnected state to true
            setAccounts(accounts);  // Updating the accounts state with the connected accounts
          }
        } catch (err) {
          console.error(err);  // Logging any errors that occur during the request
        }
      }
    };
    checkConnectedWallet();  // Calling the checkConnectedWallet function when the component mounts
  }, [setAccounts]);

  async function connectAccount() {
    if (window.ethereum) {  // Checking if the window.ethereum object is available
      try {
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",  // Requesting user permission to connect their Ethereum account
        });
        setIsConnected(true);  // Updating the isConnected state to true
        setAccounts(accounts);  // Updating the accounts state with the connected accounts
      } catch (err) {
        console.error(err);  // Logging any errors that occur during the request
      }
    } else {
      // Show the MetaMask installation modal
      setShowModal(true);  // Updating the showModal state to true
    }
  }

  const closeModal = () => {
    // Close the MetaMask installation modal
    setShowModal(false);  // Updating the showModal state to false
  };

  return (
    <nav>  {/* Opening the navigation container */}
      <div className="nav__links">  {/* Opening the container for navigation links */}
        <div>
          {/* Home link */}
          <Nav.Link as={Link} to="/">  {/* Creating a link using react-router-dom's Link component */}
            Home
          </Nav.Link>
        </div>
        <div>
          {/* Mint link */}
          <Nav.Link as={Link} to="/Mint">
            Mint
          </Nav.Link>
        </div>
        <div>
          {/* Sell link */}
          <Nav.Link as={Link} to="/Sell">
            Sell
          </Nav.Link>
        </div>
        <div>
          {/* Buy link */}
          <Nav.Link as={Link} to="/Buy">
            Buy
          </Nav.Link>
        </div>
        <div>
          {/* NFCTag link */}
          <Nav.Link as={Link} to="/NFCChipVerification">
            NFCTag
          </Nav.Link>
        </div>
      </div>  {/* Closing the container for navigation links */}
      <div className="nav__brand">  {/* Opening the container for brand/logo */}
        {/* Super Bee logo */}
        <img src={super_bee} alt="Super Bee" />  {/* Displaying the super_bee image */}
        {/* Brand name */}
        <h1>BeeTokens</h1>  {/* Displaying the brand name */}
      </div>  {/* Closing the container for brand/logo */}
      <div className="nav__links">  {/* Opening the container for connect button */}
        {isConnected ? (
          <button className="nav__connect" disabled>
            {/* Connected button */}
            Connected
          </button>
        ) : (
          <button
            type="button"
            className="nav__connect"
            onClick={connectAccount}
          >
            {/* Connect to Wallet button */}
            Connect to Wallet
          </button>
        )}
      </div>  {/* Closing the container for connect button */}
      <Modal show={showModal} onHide={closeModal}>
        {/* MetaMask installation modal */}
        <Modal.Header closeButton>  {/* Displaying the close button on the modal header */}
          <Modal.Title>MetaMask Extension Required</Modal.Title>  {/* Displaying the modal title */}
        </Modal.Header>
        <Modal.Body>  {/* Opening the modal body */}
          {/* Message to install MetaMask */}
          <p>
            To connect to the wallet, you need to install the MetaMask
            extension.
          </p>
          {/* Download MetaMask link */}
          <p>
            Please visit{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask's website
            </a>{" "}
            to download and install MetaMask.
          </p>
        </Modal.Body>  {/* Closing the modal body */}
      </Modal>  {/* Closing the MetaMask installation modal */}
      {/* Closing the navigation container */}
    </nav>  
  );
};

export default NavBar;  // Exporting the NavBar component as the default export

