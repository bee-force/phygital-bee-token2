---
# Phygital BeeToken Dapp

Phygital BeeToken Dapp is a prototype for a decentralized trading platform that enables users to tokenize and trade physical assets without the need for intermediaries. This project utilizes React and Node.js for the frontend development, Ethers.js for blockchain communication, Solidity for smart contracts, and Hardhat for smart contract development and deployment. The prototype is built on the Ethereum testnet blockchain (Sepolia), documenting provenance and ownership of the assets.

## Features

- **Tokenization**: Users can easily tokenize any physical asset by providing comprehensive information through a form within the web-accessible application.
- **Minting**: The NFT smart contract mints the physical NFT into a Phygital BeeToken and securely stores the associated data on the Ethereum testnet blockchain.
- **Trading Platform**: Users can buy and sell tokenized physical assets directly on the Phygital BeeToken Dapp, eliminating the need for intermediaries.
- **Escrow System**: The NFT and ETHs are kept in an escrow smart contract until certain conditions are met, ensuring secure and transparent payment for the physical NFT asset.

## Getting Started

To set up the project locally and explore the Phygital BeeToken Dapp, follow these steps:

1. Clone the repository: `git clone [https://github.com/bee-force/phygital-bee-token2]`
2. Install dependencies: `npm install` & at this step, ensure that all dependencies are installed.
3. Configure environment variables: Create a `.env` file in the project root directory and provide the necessary environment variables for blockchain connection and other configurations (for Metamask, Etherscan, Testnet Sepolia, and Infura API).
4. Run the frontend: `npm start`
5. Connect to the Ethereum testnet: Ensure you have a connection to the desired Ethereum testnet, such as Rinkeby or Ropsten, using an appropriate provider or wallet.
6. Explore the Dapp: Access the Phygital BeeToken Dapp by opening the provided URL in your web browser.

## Dependencies

The following dependencies are required for the project:

```json
"dependencies": {
    "@chainsafe/is-ip": "^2.0.1",
    "@openzeppelin/contracts": "^4.9.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "buffer": "^6.0.3",
    "ipfs-http-client": "^60.0.0",
    "react": "^18.2.0",
    "react-bootstrap": "^2.7.1",
    "react-diagrams": "^1.0.1",
    "react-dom": "^18.2.0",
    "react-router": "^6.8.1",
    "react-router-dom": "^6.10.0",
    "react-scripts": "5.0.1",
    "react-scroll": "^

1.8.9",
    "web-vitals": "^2.1.4"
}
```

Please ensure that these dependencies are installed by running `npm install` before running the project.

## Hardhat Config

The project includes a hardhat configuration file (`hardhat.config.js`) for managing the development environment and smart contract deployment. Developers working with the project can refer to this file for further configuration details.

## Contributing

Contributions to Phygital BeeToken Dapp are welcome! If you encounter any issues or have suggestions for improvements, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---
