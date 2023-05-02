import {pinJSONToIPFS, pinJSONAndImageToIPFS} from './pinata.js'
import { ethers } from 'ethers';
import phygitalEscrow from '../contractsData/remakePhygitalEscrow3.json'
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

const beeTokenAddress = process.env.REACT_APP_BEE_TOKEN_ADDRESS;
const phygitalEscrowAddress = process.env.REACT_APP_ESCROW_ADDRESS;

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

const dataURItoBlob = (dataURI) => {
  const byteString = Buffer.from(dataURI.split(',')[1], 'base64');
  const buffer = new Uint8Array.from(byteString);
  return new Blob([buffer], { type: 'image/png' });
};

export const mintNFT3 = async(name, description, image) => {
  //error handling
  if (name.trim() === "" || description.trim() === "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  //make metadata
  console.log("I am about to create a Javascript object");
  const metadata = {};
  metadata.name = name;
  metadata.description = description;

  console.log(image);
  // Convert the image to a File object
  //const file = dataURItoBlob(image);

  if (image instanceof File) {
    console.log("image is instance of File object")
  } else {
    console.log("find function to transform the image")
    
  }

  //make pinata call
  const pinataResponse = await pinJSONAndImageToIPFS(metadata, image);
  console.log(pinataResponse);
  console.log(pinataResponse.tokenURI);

  if (!pinataResponse.success) {
    return {
      success: false,
      status: "Something went wrong while uploading your tokenURI.",
    };
  } else {
    const tokenURI = pinataResponse.tokenURI
    console.log(tokenURI);
    handleMint(tokenURI);
    

    return {
      success: true,
      status: "lookin' good!",
      tokenURI: pinataResponse.tokenURI,
    };
  }
};


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
     beeTokenAddress,
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

export const listNFT = async(id, price) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const nft = new ethers.Contract(beeTokenAddress,phyiscalNFT.abi,signer)

  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)

  // approve escrow contract      
  const response2 = await(await nft.approve(phygitalEscrowAddress, id)).wait()
  console.log('response: ', response2)
  console.log('Hello?')

  const listingPrice = ethers.utils.parseEther(price.toString())
  console.log('price: ', listingPrice);
  
  // list NFT with escrow - so another window opens at this point? 
  //const idHex = ethers.utils.hexlify(id);
  //const BigNumber = ethers.BigNumber;
  //const idBN = BigNumber.from(id);
  await(await escrow.ListNFT(nft.address, id, listingPrice)).wait()
  console.log('Done listing')

  }

/*const p = ethers.utils.parseUnits('2')
const a = ethers.utils.parseUnits('2')

p.toString() // '2000000000000000000'
a.toString() // '2000000000000000000' */




export const cancelNFT = async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  //await(await escrow.reverseNftTransfer(id,  {gas: 1000000})).wait()
  await(await escrow.reverseNftTransfer(id)).wait()
  console.log('Done Reversing')
}


export const cancelNFT2  = async(id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const gasPrice = await provider.getGasPrice();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  const gasLimit = await signer.estimateGas(await escrow.reverseNftTransfer(id), { from: signer.getAddress() });
  const tx = await escrow.reverseNftTransfer(id, {
    gasLimit: gasLimit.mul(120).div(100),
    gasPrice: gasPrice.mul(120).div(100),
  });
  await tx.wait();
  console.log('Done Reversing');
}


export const buyNFT = async(id, price) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  // deposit eth
  const price_parsed = ethers.utils.parseEther(price.toString())
  await(await escrow.depositETH(id, {value: price_parsed})).wait()
  console.log('Done Buying')


}


export const cancelNFTSale = async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  await(await escrow.cancelBeforeDelivery(id)).wait()
  console.log('Done Canceling')
}

export const initiateDelivery= async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  await(await escrow.initiateDelivery(id)).wait()
  console.log('Done Initiating')
}


export const confirmNFTDelivery= async(id) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(phygitalEscrowAddress, phygitalEscrow.abi, signer)
  // return ownership of NFT 
  await(await escrow.confirmDeliveryFinalizeSale(id)).wait()
  console.log('Done Confirming')
}