// Import React hooks and components from external libraries
import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { ethers } from 'ethers';
import { loadItems } from "./Interact";

const Home = ({ accounts }) => {
  // Set up state variables for the list of items and loading status
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the list of items when the component mounts or when the account changes
  useEffect(() => {
    const fetchPhysicalAssets = async () => {
      setLoading(true);
      // Call the loadItems function to fetch the items
      const items = await loadItems();
      // Update the state variable with the fetched items
      setItems(items);
      // Set loading status to false once the items are fetched
      setLoading(false);
    };
    // Invoke the fetchPhyscialAssets function when the component mounts or when the account changes
    fetchPhysicalAssets();
  }, [accounts]);

  // If the list of items is still loading, display a loading message
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
                    <Card.Text>Price: {ethers.utils.formatEther(item.itemPrice)} ETH</Card.Text>
                    <img
                      src={item.image}
                      alt="Phygital"
                      style={{ maxWidth: "100%" }}
                    />
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <button
                        id="pressButton"
                        onClick={() => (window.location.href = "/Buy")}
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
