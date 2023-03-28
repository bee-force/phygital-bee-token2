import {pinJSONToIPFS} from './pinata.js'
import { ethers } from 'ethers';
import phygitalEscrow from '../contractsData/Remake_PhygitalEscrow.json'
import phyiscalNFT from '../contractsData/BeeToken.json'

import { create as ipfsHttpClient } from 'ipfs-http-client'
export let Buffer = require("buffer").Buffer

const projectId = '2LTSVvQAYQc7Hd16uvGco7VgROt';
const projectSecret = '69af64cda025fa2afe32054a152a31a3';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

// address of deployed NFT smart contract
const physicalNFTAddress = '0x944A8Ae87be2e8b134002D26139c7a888aFd38F6';
const phygitalEscrowAddress = '0x998Cf6565aa1FE53721E9e77361a0f876f8E6547';
const phygitalEscrowAddress2 = '0xcFA0882376258a6912CC2f322DB139bCf6ad46A2'; 
const phygitalEscrowAddress3 = '0x0b552646576d03eA256F086ae336e8c2F11a104A';
const phygitalEscrowAddress4 = '0x23e3182C4f1a5F2A54CF416B7f13475748b227A9'; // this is the one I am using! 


export const mintNFT = async(name, description) => {
    //error handling
    if ((name.trim() === "" || description.trim() === "")) {
      return {
       success: false,
       status: "❗Please make sure all fields are completed before minting.",
      }
     }

     //make metadata
  console.log("I am about to create a Javascript object")   
  const metadata = {};
  metadata.name = name;
  metadata.description = description;

  //make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
      return {
          success: false,
          status: "Something went wrong while uploading your tokenURI.",
      }
  } 
  else {
      const tokenURI = pinataResponse.pinataUrl;
    //console.log("Looking @ the tokenuri once again")
    console.log(tokenURI);
    handleMint(tokenURI);

    return {
      success: true,
      status: "lookin' good!",
      tokenURI: pinataResponse.pinataUrl
    }
  }

}

// ucaught (in promise) TypeError: undefined has no properties
export const mintNFT2 = async(name, description) => {

//make metadata
console.log(name)

console.log("I am about to use JSON stringify")    

const result = await client.add(JSON.stringify({name, description}))

console.log("This is the JSON result: " + result)

const uri = `https://ipfs.infura.io/ipfs/${result.path}`
  
  handleMint(uri);
  
}


async function handleMint(uri) {
  // if user is connected or has metamask logged in
  if (window.ethereum) {
  // a way for ethers to connect to the blockchain 
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // sth that signs the transaction 
    const signer = provider.getSigner();
    //pinata token uri
    //const tokenURI = pinataURI;
    // this is were the address is passed (ABI)
    const contract = new ethers.Contract(
     //SimpleNFTAddress,
     //SimpleNFT.abi, 
     physicalNFTAddress,
     phyiscalNFT.abi,
      signer,
        );
  try {
    console.log("this is the uri " + uri)
    const response = await(await contract.mint(uri)).wait()
    console.log('response: ', response)
     } catch (err) {
        console.log("error: ", err)
      }
    }
}

export const listNFT = async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const nft = new ethers.Contract(physicalNFTAddress,phyiscalNFT.abi,signer)

  const escrow = new ethers.Contract(phygitalEscrowAddress4, phygitalEscrow.abi, signer)

  // approve escrow contract      
  const response2 = await(await nft.approve(phygitalEscrowAddress4, id)).wait()
  console.log('response: ', response2)
  console.log('Hello?')

  const price = 1;
  const listingPrice = ethers.utils.parseEther(price.toString())
  console.log(listingPrice);
  // why is this being ignored??
  // list NFT with escrow - so another window opens at this point? 
  await(await escrow.ListNFT(nft.address, id, listingPrice)).wait()
  console.log('Done listing')

  }

/*const p = ethers.utils.parseUnits('2')
const a = ethers.utils.parseUnits('2')

p.toString() // '2000000000000000000'
a.toString() // '2000000000000000000' */




export const cancelNFT = async() => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  await(await escrow.reverseNftTransfer()).wait()
  console.log('Done Reversing')
}

export const buyNFT = async(id, price) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress4, phygitalEscrow.abi, signer)
  // deposit eth
  const price_parsed = ethers.utils.parseEther(price.toString())
  await(await escrow.depositETH(id)).wait()
  console.log('Done Buying')


}


export const cancelNFTSale = async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress4, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  await(await escrow.cancelBeforeDelivery(id)).wait()
  console.log('Done Canceling')
}



export const confirmNFTDelivery= async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress4, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  await(await escrow.confirmDelivery(id)).wait()
  console.log('Done Confirming')
}