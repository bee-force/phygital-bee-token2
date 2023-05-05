// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract remakePhygitalEscrow3 is ReentrancyGuard {

   // monitors progress - why do we need that? maybe for output in UI 
enum ItemState {
    newEscrow,
    nftDeposited, 
    cancelNFT, 
    ethDeposited, 
    canceledBeforeDelivery, 
    deliveryInitiated, 
    delivered
}

// Variables
address payable public immutable feeAccount; // the account that receives fees
uint public immutable feePercent = 1; // the fee percentage on sales 
uint public itemCount; 

address payable public seller;
address payable public buyer;

IERC721 nft;

struct Item {
    uint256 tokenId;
    uint price;
    address payable seller;
    ItemState state;
}

// Index per item in mapping named items    
mapping(uint256 => Item) public items;
mapping(uint256 => uint256) public tokenIdToItemId; // added mapping for tokenId lookup

modifier condition(bool _condition) {
	require(_condition, "Condition not met");
	_;
}

modifier onlySeller() {
	require(msg.sender == seller, "Not the seller");
	_;
}

modifier onlyBuyer() {
	require(msg.sender == buyer, "Not the buyer");
	_;
}

modifier BuyerOrSeller() {
	require(msg.sender == buyer || msg.sender == seller, "Not authorized");
	_;
}

constructor() {
    feeAccount = payable(msg.sender);
}

function listNFT(IERC721 _nft, uint256 _tokenId, uint256 _price) external nonReentrant {
    itemCount ++;
    seller = payable(msg.sender);
    _nft.transferFrom(msg.sender, address(this), _tokenId);

    // initialise struct and mapping     
    items[itemCount] = Item (
        _tokenId,
        _price,
        payable(msg.sender),
        ItemState.nftDeposited
    );

    tokenIdToItemId[_tokenId] = itemCount; // store the itemId for the tokenId
}

function setItemStateByTokenId(uint256 tokenId, ItemState newState) public {
    for (uint256 i = 0; i < itemCount; i++) {
        if (items[i].tokenId == tokenId) {
            items[i].state = newState;
            return;
        }
    }
    revert("Item not found for the given tokenId");
}

function setSoldByTokenId(uint256 tokenId, bool soldState) public {
    for (uint256 i = 0; i < itemCount; i++) {
        if (items[i].tokenId == tokenId) {
            items[i].sold = soldState;
            return;
        }
    }
    revert("Item not found for the given tokenId");
}

function reverseNftTransfer(uint _tokenId) public onlySeller {
    IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
    setItemStateByTokenId(_tokenId, ItemState.cancelNFT);
}

function cancelBeforeDelivery(uint _tokenId) public BuyerOrSeller {
    IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
    buyer.transfer(address(this).balance);
    setItemStateByTokenId(_tokenId, ItemState.canceledBeforeDelivery);
}

function depositETH(uint _tokenId) public payable {    
    buyer = payable(msg.sender); // buyer is set here
    uint _totalPrice = getTotalPrice(_tokenId);

    require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");

    setSoldByTokenId(_tokenId, true);
    setItemStateByTokenId(_tokenId, ItemState.ethDeposited);
}

function initiateDelivery(uint _tokenId) public onlySeller {
    setItemStateByTokenId(_tokenId, ItemState.deliveryInitiated);
}  

function confirmDeliveryFinalizeSale(uint _tokenId) public onlyBuyer {
    uint _totalPrice = getTotalPrice(_tokenId);
    IERC721(nft).safeTransferFrom(address(this), buyer, _tokenId); 
    // Transfer ETH to seller 
    seller.transfer(address(this).balance);
    feeAccount.transfer(_totalPrice - items[_tokenId].price);
    setItemStateByTokenId(_tokenId, ItemState.delivered);
}

   function getTotalPrice(uint _tokenId) view public returns(uint){
        return((items[_tokenId].price*(100 + feePercent))/100);
    }
}
