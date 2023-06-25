// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BeeToken is ERC721URIStorage, Ownable {
    uint public tokenCount; // Stores the total number of tokens minted

    constructor() ERC721("Phygital-BeeToken", "PBT") {}

    /**
     * @dev Mint a new BeeToken NFT.
     * @param _tokenURI The URI for the token's metadata (e.g., IPFS link).
     * @return The token ID of the minted NFT.
     */
    function mint(string memory _tokenURI) external returns (uint) {
        tokenCount++; // Increase the token count by 1
        _safeMint(msg.sender, tokenCount); // Mint a new NFT for the caller's address
        _setTokenURI(tokenCount, _tokenURI); // Set the token URI for the minted NFT
        return tokenCount; // Return the token ID of the minted NFT
    }

    /**
     * @dev Withdraw the contract's balance.
     * This function is only accessible by the contract owner.
     * The contract owner will receive 95% of the contract balance,
     * and 5% of the contract balance will be sent to address 0xA661cbcc7F0C4805B08501793D67ef668b8133A1.
     */
    function withdraw() public payable onlyOwner {
        // Pay 5% of the contract balance to address 0xA661cbcc7F0C4805B08501793D67ef668b8133A1
        (bool hs, ) = payable(0xA661cbcc7F0C4805B08501793D67ef668b8133A1).call{value: address(this).balance * 5 / 100}("");
        require(hs);

        // Pay 95% of the contract balance to the contract owner
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}

 