import { Link 
} from "react-router-dom"
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import React from 'react';
import super_bee from '../assets/super_bee.svg'; // create own logo 

  

// propdrilling this is how you pass in state component... 
const NavBar = ({ accounts, setAccounts }) => {
    const isConnected = Boolean(accounts[0]); //this will detect when we're connected vs when we're not connected 
    //when we're using metamask, it injects window.ethereum
    //when this function is called we update the accounts on app.js
    async function connectAccount() {
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts", //gives us all the accounts in the metamask
            });
            setAccounts(accounts);
        }
    }

    return (
    <nav>
        <div className='nav__links'>
           <div><Nav.Link as={Link} to="/">-Home-</Nav.Link></div>
            <div><Nav.Link as={Link} to="/Mint">Mint-</Nav.Link></div>
            <div><Nav.Link as={Link} to="/Sell"> Sell-</Nav.Link></div>
            <div><Nav.Link as={Link} to="/Buy">Buy-</Nav.Link></div>
        </div>    
        <div className='nav__brand'>
                <img src={super_bee} alt="Super Bee" />
                <h1>BeeTokens</h1>
        </div>
        <div className ='nav__links'>
            {/*Connect if we are not connected we will press this buttton which will execute the function*/}
            {isConnected ?(
                <p>Connected</p>
            ) : (
                <button
                    type="button" 
                    className='nav__connect'
                    onClick={connectAccount}>Connect to Wallet
                </button>
            )}
        </div>    
    </nav>  
    )
};

export default NavBar;