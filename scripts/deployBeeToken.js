const hre = require("hardhat");

async function main() {

const beeToken = await hre.ethers.getContractFactory("beeToken");
const bee_Token = await beeToken.deploy();
await bee_Token.deployed();

  console.log(
    "The Phygital-Bee-Token has been deployed to: ", bee_Token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 