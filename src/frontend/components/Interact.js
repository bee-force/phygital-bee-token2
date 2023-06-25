import { pinJSONAndImageToIPFS } from "./pinata.js";
import { ethers } from "ethers";

// Import JSON data for the BeeToken smart contract and the BeeToken Escrow smart contract
import beeToken from "../contractsData/beeToken.json";
import beeTokenEscrow from "../contractsData/beeTokenEscrow.json";

// Get the BeeToken and BeeToken Escrow smart contract addresses from environment variables
const beeTokenAddress = process.env.REACT_APP_BEE_TOKEN_ADDRESS;
const beeTokenEscrowAddress = process.env.REACT_APP_ESCROW_ADDRESS;

export const loadItems = async () => {
  // Connect to the Web3 provider using the Ethereum wallet in the user's browser
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const nft = new ethers.Contract(beeTokenAddress, beeToken.abi, signer);
  const listedNFT = new ethers.Contract(
    beeTokenEscrowAddress,
    beeTokenEscrow.abi,
    signer
  );

  // Testing purposes
  const balanceWei = await provider.getBalance(beeTokenEscrowAddress);
  const balanceEth = ethers.utils.formatEther(balanceWei);
  console.log(`The balance of ${beeTokenEscrowAddress} is ${balanceEth} ETH`);
  const itemCount = await listedNFT.itemCount();
  console.log("Num of Tokens: " + itemCount);

  let items = [];
  for (let i = 1; i <= itemCount; i++) {
    const item = await listedNFT.items(i);
    console.log("TokenId1 " + item.tokenId);
    console.log("Token State1 " + item.state);
    console.log("Token Price" + item.price)

    if (!item.sold && item.state === 1) {
      // add another condition like to check the state if possible
      // testing purposes
      console.log("TokenId2 " + item.tokenId);
      console.log("Token State2 " + item.state);
      console.log(item.sold);
      // get uri url from nft contract
      const uri = await nft.tokenURI(item.tokenId);
      // use uri to fetch the nft metadata stored on ipfs - not sure if this will work out with m stuff
      const response = await fetch(uri);
      const metadata = await response.json();

      items.push({
        itemId: item.itemId,
        seller: item.seller,
        tokenId: item.tokenId,
        itemPrice: item.price,
        state: item.state,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
      });
    }
  }

  return items;
};

export const mintNFT = async (name, description, image) => {
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

  if (image instanceof File) {
    console.log("image is instance of File object");
  } else {
    console.log("find function to transform the image");
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
    const tokenURI = pinataResponse.tokenURI;
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
    // this is were the address is passed (ABI)
    const contract = new ethers.Contract(beeTokenAddress, beeToken.abi, signer);
    try {
      console.log("this is the uri " + uri);
      const response = await (await contract.mint(uri)).wait();
      console.log("response: ", response);
    } catch (err) {
      console.log("error: ", err);
    }
  }
}

export const listNFT = async (id, price) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const nft = new ethers.Contract(beeTokenAddress, beeToken.abi, signer);

  const escrow = new ethers.Contract(
    beeTokenEscrowAddress,
    beeTokenEscrow.abi,
    signer
  );

  // approve escrow contract
  const response2 = await (await nft.approve(beeTokenEscrowAddress, id)).wait();
  console.log("response: ", response2);
  console.log("Hello?");

  const listingPrice = ethers.utils.parseEther(price.toString());
  console.log("price: ", listingPrice);

  // list NFT with escrow - so another window opens at this point?
  //const idHex = ethers.utils.hexlify(id);
  //const BigNumber = ethers.BigNumber;
  //const idBN = BigNumber.from(id);
  await (await escrow.listNFT(nft.address, id, listingPrice)).wait();
  console.log("Done listing");
};

export const cancelNFTListing = async (id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(beeTokenEscrowAddress, beeTokenEscrow.abi, signer);
  // return ownership of NFT
  //await(await escrow.reverseNftTransfer(id,  {gas: 1000000})).wait()
  await (await escrow.reverseNftTransfer(id)).wait();
  console.log("Done Reversing");
};

export const buyNFT = async (id, price) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(beeTokenEscrowAddress, beeTokenEscrow.abi, signer);
  // deposit eth
  const price_parsed = ethers.utils.parseEther(price.toString());
  console.log(id);
  await (await escrow.depositETH(id, { value: price_parsed })).wait();
  console.log("Done Buying");
};

export const cancelNFTSaleBeforeDelivery = async (id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(beeTokenEscrowAddress, beeTokenEscrow.abi, signer);
  // return ownership of NFT
  //await(await escrow.cancelBeforeDelivery(id)).wait()

  // return ownership of NFT
  const tx = await escrow.cancelBeforeDelivery(id);
  const gasLimit = 1000000; // set the gas limit value
  await tx.wait({ gasLimit });

  console.log("Done Canceling");
};

export const initiateDelivery = async (id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(beeTokenEscrowAddress, beeTokenEscrow.abi, signer);
  // return ownership of NFT
  await (await escrow.initiateDelivery(id)).wait();
  console.log("Done Initiating");
};

export const confirmNFTDelivery = async (id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const escrow = new ethers.Contract(beeTokenEscrowAddress, beeTokenEscrow.abi, signer);
  // return ownership of NFT
  await (await escrow.confirmDeliveryFinalizeSale(id)).wait();
  console.log("Done Confirming");
};

/*export const loadItemState = async (tokenId) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const listedNFT = new ethers.Contract(
    beeTokenEscrowAddress,
    beeTokenEscrow.abi,
    signer
  );*/

export const loadItemState = async (tokenId) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const listedNFT = new ethers.Contract(
    beeTokenEscrowAddress,
    beeTokenEscrow.abi,
    signer
  );

  // Mapping for item states
  const itemStateMapping = {
    0: "New Escrow",
    1: "NFT Is For Sale",
    2: "NFT Sale Cancelled",
    3: "ETHs Deposited",
    4: "Cancellation Before Delivery",
    5: "Delivery Initiated",
    6: "Delivered & Confirmed --> Done Deal",
  };

  const itemCount = await listedNFT.itemCount();
  for (let i = 1; i <= itemCount; i++) {
    const item = await listedNFT.items(i);
    if (item.tokenId == tokenId) {
      console.log(item.tokenId);
      console.log(item.state);
      console.log(item.sold);
      // Convert the numeric state to its corresponding meaning
      const itemState = itemStateMapping[item.state];
      return itemState;
    }
  }
};
