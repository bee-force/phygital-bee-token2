const hre = require("hardhat");

async function main() {

const PhygitalEscrow= await hre.ethers.getContractFactory("PhygitalEscrow");
const phygital_Escrow = await PhygitalEscrow.deploy();
await phygital_Escrow.deployed();

  console.log(
    //`nftCreator with 1 ETH and unnftCreator timestamp ${unnftCreatorTime} deployed to ${physical_NFT.address}`
    "Escrow Contract for Phygital NFT has been deployed to: ", phygital_Escrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 