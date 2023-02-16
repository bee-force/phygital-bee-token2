// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//state variable only functions within contract can modify the state variable - requires gas to call the function 
contract beeToken is ERC721URIStorage, Ownable {
    uint public tokenCount;
    // constructor function is called when contract is deployed onto blockchain, inherited contract erc721
    constructor() ERC721("Phygital-BeeToken", "PBT"){}
    // when minting we are passing the link to the metadata (ipfs in this case)
    // when passing strings you need to specify the memory location of the argument & set visability of the function, is supposed to called from the outside: external keyword & return current tokencount + datatype
    function mint(string memory _tokenURI) external returns(uint) {
        // increase tokencount by 1 
        tokenCount ++;
        // mint a new nft, by calling the internal safe mint function, 1st argument the address that we're minting for - caller address
        _safeMint(msg.sender, tokenCount);
        // id of token we can get from token count 
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }

function withdraw() public payable onlyOwner {
    // This will pay Berta of the initial sale.
    // You can remove this if you want, or keep it in to support HashLips and his channel.
    // =============================================================================
    (bool hs, ) = payable(0xA661cbcc7F0C4805B08501793D67ef668b8133A1).call{value: address(this).balance * 5 / 100}("");
    require(hs);
    // =============================================================================
    
    // This will payout the owner 95% of the contract balance.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }

}
 