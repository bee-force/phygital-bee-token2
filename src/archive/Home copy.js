import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";

import physicalNFT from "../frontend/contractsData/BeeToken.json";
import phygitalEscrowJson from "../contractsData/remakePhygitalEscrow3.json";

const beeTokenAddress = process.env.REACT_APP_BEE_TOKEN_ADDRESS;
const phygitalEscrowAddress = process.env.REACT_APP_ESCROW_ADDRESS;

const Home = ({ accounts }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    // Load all unsold items
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // NFT
    const nft = new ethers.Contract(beeTokenAddress, physicalNFT.abi, signer);
    const listedNFT = new ethers.Contract(
      phygitalEscrowAddress,
      phygitalEscrowJson.abi,
      signer
    );

    // Testing purposes
    const balanceWei = await provider.getBalance(phygitalEscrowAddress);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    console.log(`The balance of ${phygitalEscrowAddress} is ${balanceEth} ETH`);
    const itemCount = await listedNFT.itemCount();
    console.log(itemCount);

    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await listedNFT.items(i);
      if (!item.sold && item.state == 1) {
        // add another condition like to check the state if possible
        // testing purposes
        console.log(item.tokenId);
        console.log(item.state);
        console.log(item.sold);
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs - not sure if this will work out with m stuff
        const response = await fetch(uri);
        const metadata = await response.json();

        //console.log(metadata.image);
        // get total price of item (item price + fee)
        //const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array

        items.push({
          itemId: item.itemId,
          seller: item.seller,
          tokenId: item.tokenId,
          state: item.state,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    setLoading(false);
    setItems(items);
  };

  useEffect(() => {
    loadItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card className="rounded">
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Description: {item.description}</Card.Text>
                    <Card.Text>Token ID: {item.tokenId.toNumber()}</Card.Text>
                   <img src={item.image} alt="Phygital Image" style={{ maxWidth: "100%"}} />
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <button
                        id="mintButton"
                        onClick={(event) => (window.location.href = "/Buy")}
                      >
                        Buy NFT
                      </button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets avaiable.</h2>
        </main>
      )}
    </div>
  );
};

export default Home;
