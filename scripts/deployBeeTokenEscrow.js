const hre = require("hardhat");

async function main() {

const beeTokenEscrow = await hre.ethers.getContractFactory("beeTokenEscrow");
const beeToken_Escrow = await beeTokenEscrow.deploy();
await beeToken_Escrow.deployed();

  console.log(
    "BeeToken Escrow Contract has been deployed to: ", beeToken_Escrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 