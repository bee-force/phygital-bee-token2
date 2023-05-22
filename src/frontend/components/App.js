// Import necessary components and libraries for routing and navigation
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
// browserrouter provides the functionality, routes is the container for the specific routes
import Navbar from "./NavBar.js";
import Home from "./Home.js";
import Mint from "./Mint.js";
import Sell from "./Sell.js";
import Buy from "./Buy.js";
import NFCChip from "./NFCChipVerification.js";
import { useState } from "react";

import "./App.css";

// Define the main App component
function App() {
  /*In the line const [accounts, setAccounts] = useState([]);, we initialize a state variable called accounts using the useState Hook. 
  We start with an initial state value of an empty array ([]).
  The useState([]) call returns an array with two elements: accounts and setAccounts.
  The accounts element represents the current state value. Initially, it will be an empty array since we provided an empty array as the initial state.
  The setAccounts element is a function that allows us to update the accounts state. When we call setAccounts with a new value, 
  it modifies the accounts state and triggers a re-render of the component.
  By using const [accounts, setAccounts] = useState([]);, we create a state variable named accounts and its corresponding updater function named setAccounts. 
  The accounts variable holds the current state value, and setAccounts is used to update the state with a new value whenever necessary. 
  Whenever the setAccounts function is called with a new value, it updates the accounts state. This triggers a re-render of the component, 
  and the component will reflect the updated value of accounts in its UI.*/
  // Set up state variable for accounts
  const [accounts, setAccounts] = useState([]);

  // Render the App component
  return (
    // Set up the BrowserRouter for routing
    <BrowserRouter>
      <div className="App">
        {/* Render the Navbar component and pass accounts and setAccounts as props */}
        <Navbar accounts={accounts} setAccounts={setAccounts} />
        <div>
          <Routes>
            {/* Define routes and corresponding components */}
            <Route path="/" element={<Home accounts={accounts} />} />
            <Route path="/Mint" element={<Mint accounts={accounts} />} />
            <Route path="/Sell" element={<Sell accounts={accounts} />} />
            <Route path="/Buy" element={<Buy accounts={accounts} />} />
            <Route path="/NFCChipVerification" element={<NFCChip accounts={accounts} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Export the App component as the default export
export default App;
