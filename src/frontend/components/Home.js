import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';
import { buyNFT} from "./Interact";

import physicalNFT from '../contractsData/BeeToken.json'
import phygitalEscrow from '../contractsData/Remake_PhygitalEscrow.json'
import { json } from 'react-router';

// address of deployed NFT smart contract
const physicalNFTAddress = '0x944A8Ae87be2e8b134002D26139c7a888aFd38F6';
// address of deployed Escrow smart contract 
const phygitalEscrowAddress = '0x998Cf6565aa1FE53721E9e77361a0f876f8E6547';
const phygitalEscrowAddress2 = '0xcFA0882376258a6912CC2f322DB139bCf6ad46A2'; 
const phygitalEscrowAddress4 = '0x23e3182C4f1a5F2A54CF416B7f13475748b227A9'; 

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
      const nft = new ethers.Contract(physicalNFTAddress, physicalNFT.abi,signer)
      const listedNFT = new ethers.Contract(phygitalEscrowAddress4, phygitalEscrow.abi, signer)

      const itemCount = await listedNFT.itemCount()
      console.log(itemCount);
      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await listedNFT.items(i)
        if (!item.sold) {
          // get uri url from nft contract
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
