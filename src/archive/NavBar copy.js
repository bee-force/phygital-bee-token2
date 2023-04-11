import { Link } from "react-router-dom";
import { Nav, Navbar } from 'react-bootstrap';
import React from 'react';
import super_bee from '../assets/super_bee.svg';

const NavBar = ({ accounts, setAccounts }) => {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    if(window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }

  return (
    <Navbar expand="lg" className="navbar-light bg-light">
      <div className="container-fluid">
        <Navbar.Brand>
          <img src={super_bee} alt="Super Bee" />
          <h1>BeeTokens</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/Mint">Mint</Nav.Link>
            <Nav.Link as={Link} to="/Sell">Sell</Nav.Link>
            <Nav.Link as={Link} to="/Buy">Buy</Nav.Link>
            <Nav.Link as={Link} to="/NFCChipValidation">NFCTag</Nav.Link>
          </Nav>
          <Nav>
            {isConnected ? (
              <button className='nav__connect'>Connected</button>
            ) : (
              <button
                type="button"
                className='nav__connect'
                onClick={connectAccount}
              >
                Connect to Wallet
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavBar;
