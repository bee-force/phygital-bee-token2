import { useState } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';

import physicalNFT from '../contractsData/BeeToken.json'
import phygitalEscrow from '../contractsData/nft_escrow.json'

// address of deployed NFT smart contract
const physicalNFTAddress = '0x944A8Ae87be2e8b134002D26139c7a888aFd38F6';
//'0x79Ecff6D5d6F74ca2A9fdF98A44AFE5695CFbB03';
const phygitalEscrowAddress = '0xEa93D6883f52681AB4946ADCB2Ac2f4aE673d6A9';

const Home = ({ accounts }) => {

const isConnected = Boolean(accounts[0]); 
const metaname = '';
const description= ''; 
//const [metaname, setMetaName] = useState(""); // string that stores the NFT's name
//const [description, setDescription] = useState(""); //string that stores the description
//const[value, setValue] = useState({})
//const [items, setItems] = useState([])
  //const [nft, setNFT] = useState({})
const [listed_nft, setListedNFT] = useState({})

 const loadItems = async() => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const nft = new ethers.Contract(physicalNFTAddress, physicalNFT.abi,signer)

  console.log('i am here')

  const uri = await nft.tokenURI(1)
  console.log(uri)
  
  const response2 = await fetch(uri)
  console.log(response2)

  const metadata = await response2.json()

  console.log('response: ', metadata)

  metaname = metadata.name
  description = metadata.description
  
  console.log('metadata transformation: ' + metaname)


   // Escrow
   listed_nft = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
   setListedNFT(listed_nft)


  }


    return (
        <div className="flex justify-center">
              <h2>No listed phygitals</h2>

              <Button onClick={() => loadItems()} variant="primary" size="lg">
                  Test
              </Button>

              <Card>
                    <Card.Body color="secondary">
                      <Card.Title>'Hello'</Card.Title>
                      <Card.Text>
                        'it's me'
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <p>Buy Button</p>
                      </div>
                    </Card.Footer>
                  </Card>

              

      </div>
    );
}

export default Home;