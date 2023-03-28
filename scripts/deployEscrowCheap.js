const hre = require("hardhat");

async function main() {

const Remake_PhygitalEscrow= await hre.ethers.getContractFactory("Remake_PhygitalEscrow");
const remake_phygital_Escrow = await Remake_PhygitalEscrow.deploy();
await remake_phygital_Escrow.deployed();

  console.log(
    //`nftCreator with 1 ETH and unnftCreator timestamp ${unnftCreatorTime} deployed to ${physical_NFT.address}`
    "Escrow Contract for REMAKE Phygital NFT has been deployed to: ", remake_phygital_Escrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 