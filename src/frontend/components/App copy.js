import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
  import Navbar from './NavBar.js';
  import Home from './Home.js';
  import Mint from './Mint.js';
  import Sell from './Sell.js';
  import Buy from './Buy.js';
  import NFCChipValidation from './NFCChipValidation.js'
  import { useState } from 'react';
  
  import './App.css';
  
  function App() {

    const [accounts, setAccounts] = useState([]); //passing them into navbar & Mintfct 

    return (
      <BrowserRouter>
        <div className="App">
          <>
            <Navbar accounts={accounts} setAccounts={setAccounts} />
          </>
            <div>
              <Routes>
                <Route path="/" element={
                  <Home accounts={accounts} setAccounts={setAccounts} />
                } />
                <Route path="/Mint" element={
                  <Mint accounts={accounts} setAccount={setAccounts} />
                } />
                <Route path="/Sell" element={
                  <Sell accounts={accounts} setAccount={setAccounts} />
                } />
                <Route path="/Buy" element={
                  <Buy accounts={accounts} setAccount={setAccounts} />
                } />
                 <Route path="/NFCChipValidation" element={
                 <NFCChipValidation accounts={accounts} setAccount={setAccounts} />}/> 
              </Routes>
              </div>
            </div>
      </BrowserRouter>
  
    );
}
  export default App;
  