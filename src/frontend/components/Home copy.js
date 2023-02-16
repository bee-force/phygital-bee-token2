import { useState } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';
import physicalNFT from '../contractsData/physicalNFT.json';
import phygitalEscrow from '../contractsData/nft_escrow.json';

// address of deployed NFT smart contract
const physicalNFTAddress = '0x95f533a9950b7D11872519D073C525325b982571';
const phygitalEscrowAddress = '0x4D5C42d6beB8CcA4F014a1249074DB70303B3e8b';

const Home = ({ accounts }) => {

  const isConnected = Boolean(accounts[0]); 
  //const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [nft, setNFT] = useState({})
  const [listed_nft, setListedNFT] = useState({})

  // get contracts
  // get provider from metamask 
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // set signer
  const signer = provider.getSigner();
  // Escrow
  listed_nft = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  setListedNFT(listed_nft)
  nft = new ethers.Contract(physicalNFTAddress, physicalNFT.abi, signer)
  setNFT(nft)

// maybe also move this stuff to "Interact"
// get nfts there are listed (therefore in escrow)
  const loadItems = async () => {
    // Load all unsold items
    const itemCount = await listed_nft.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await listed_nft.items(i)
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
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    //setLoading(false)
    setItems(items)
  }    
    
    return (
        <div className="flex justify-center">
        {items.length > 0 ?
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {items.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => loadItems(item)} variant="primary" size="lg">
                          Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed phygitals</h2>
            </main>
          )}
      </div>
    );
}

export default Home;