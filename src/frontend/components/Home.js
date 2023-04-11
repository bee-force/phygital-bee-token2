import dotenv from 'dotenv';
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';
import { buyNFT} from "./Interact";

import physicalNFT from '../contractsData/BeeToken.json'
//import escrowAddress from '../contractsData/Remake_PhygitalEscrow.json'
import escrowAddress from '../contractsData/remakePhygitalEscrow3.json'
import { json } from 'react-router';

require('dotenv').config();
const beeTokenAddress = process.env.BEE_TOKEN_ADDRESS;
//const escrowAddress = process.env.ESCROW_ADDRESS;


const phygitalEscrowAddress = '0xBd3FAf6360D920Ff31A806813CFAd30f11fa1803';


const Home = ({ accounts }) => {
  const isConnected = Boolean(accounts[0]); 
  //const [metaname, setMetaName] = useState(""); // string that stores the NFT's name
  //const [description, setDescription] = useState(""); //string that stores the description
  //const[value, setValue] = useState({})
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  //const [nft, setNFT] = useState({})
  const [listedNFT, setListedNFT] = useState({})

  /*const onBuyPressed= async () => {
    const { status } = await buyNFT(id);
    setStatus(status);
};*/
  
const onBuyPressed= async (item) => {
  const { status } = await buyNFT(item.itemId, { value: item.totalPrice });
  loadItems()
  console.log('Lets buy some NFTs')
};


   const loadItems = async() => {
    // Load all unsold items 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // NFT
      const nft = new ethers.Contract(beeTokenAddress, physicalNFT.abi,signer)
      const listedNFT = new ethers.Contract(escrowAddress
      , escrowAddress.abi, signer)

      const address = '0xA661cbcc7F0C4805B08501793D67ef668b8133A1';
      const balanceWei = await provider.getBalance(escrowAddress
      );
      //const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      console.log(`The balance of ${escrowAddress
    } is ${balanceEth} ETH`);



      const itemCount = await listedNFT.itemCount()
      console.log(itemCount);


      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await listedNFT.items(i)
        if (!item.sold && item.state == 1) { // add another condition like to check the state if possible 
          // get uri url from nft contract
          console.log(item.tokenId);
          console.log(item.state);
          console.log(item.sold);

          const uri = await nft.tokenURI(item.tokenId)
          // use uri to fetch the nft metadata stored on ipfs - not sure if this will work out with m stuff 
          const response = await fetch(uri)
          const metadata = await response.json()
          // get total price of item (item price + fee)
          //const totalPrice = await marketplace.getTotalPrice(item.itemId)
          // Add item to items array
          items.push({
            itemId: item.itemId,
            seller: item.seller,
            tokenId: item.tokenId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
          })
      } 
    }
    setLoading(false)
    setItems(items)   
    console.log(items)  
  }

  useEffect(() => {
    loadItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

    return (
        <div className="flex justify-center">
        {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
              <Card>
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        Description: {item.description} 
                      </Card.Text>
                      <Card.Text>
                      ID: {JSON.stringify(item.tokenId)}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <button id="buyButton" onClick={onBuyPressed}>Future Buy Button/ Link to other page?
                        </button>
                      </div>
                    </Card.Footer>
                  </Card>
                  </Col>
            ))}
          </Row>
        </div>
         : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
      </div>
    );
}

export default Home;