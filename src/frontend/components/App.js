import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
  import Navbar from './NavBar.js';
  import Home from './Home.js';
  import Mint from './Mint.js';
  import SellBuy from './SellBuy.js';
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
                <Route path="/SellBuy" element={
                  <SellBuy accounts={accounts} setAccount={setAccounts} />
                } />
              </Routes>

              </div>
            </div>
      </BrowserRouter>
  
    );
}
  export default App;
  