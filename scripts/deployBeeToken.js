// Importing the necessary libraries
const hre = require("hardhat");

// Defining the main function
async function main() {
  // Retrieving the contract factory
  const beeToken = await hre.ethers.getContractFactory("beeToken");
  
  // Deploying the contract
  const bee_Token = await beeToken.deploy();

  // Logging the contract address
  console.log("The Phygital-Bee-Token has been deployed to: ", bee_Token.address);
}

// Executing the main function
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
