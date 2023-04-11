const hre = require("hardhat");

async function main() {

const remakePhygitalEscrow3= await hre.ethers.getContractFactory("remakePhygitalEscrow3");
const remake_phygitalEscrow3 = await remakePhygitalEscrow3.deploy();
await remake_phygitalEscrow3.deployed();

  console.log(
    //`nftCreator with 1 ETH and unnftCreator timestamp ${unnftCreatorTime} deployed to ${physical_NFT.address}`
    "Escrow Contract for REMAKE Phygital NFT has been deployed to: ", remake_phygitalEscrow3.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 