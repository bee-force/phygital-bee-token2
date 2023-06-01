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
    delivered}

   // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent = 1; // the fee percentage on sales 
    uint public itemCount; 

    address payable public seller;
    address payable public buyer;

    // these 2 are saved in items also, so they could be redundant but I am keeping them for now
    //uint256 tokenID;
    IERC721 nft;

    // maybe leave out sold?
    struct Item {
        uint itemId;
        uint256 tokenId;
        IERC721 nft;
        uint price;
        address payable seller;
        bool sold;
        ItemState state;
    }

    // Index per item in mapping named items    
    mapping(uint => Item) public items;

   	modifier condition(bool _condition) {
		require(_condition);
		_;
	}

	modifier onlySeller() {
		require(msg.sender == seller);
		_;
	}

	modifier onlyBuyer() {
		require(msg.sender == buyer);
		_;
	}
	
	modifier BuyerOrSeller() {
		require(msg.sender == buyer || msg.sender == seller);
		_;
	}

    constructor() {
        feeAccount = payable(msg.sender);
    }

    function ListNFT(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        //require(_price > 0, "Price must be greater than zero");
        itemCount ++;
        //tokenID = _tokenId;
        nft = _nft;
        seller = payable(msg.sender);
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        // initialise struct and mapping     
        items[itemCount] = Item (
            itemCount,
            _tokenId,
            _nft,
            _price,
            payable(msg.sender),
            false,
            ItemState.nftDeposited
        );
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

    function cancelBeforeDelivery(uint _tokenId) public BuyerOrSeller
    {
        IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
        buyer.transfer(address(this).balance);
        setItemStateByTokenId(_tokenId, ItemState.canceledBeforeDelivery);
    }


    function depositETH(uint _tokenId) public payable
    {    
       
        buyer = payable(msg.sender); // buyer is set here
        uint _totalPrice = getTotalPrice(_tokenId);

        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");

        setSoldByTokenId(_tokenId, true); // sold is not set to true after calling this function...
        setItemStateByTokenId(_tokenId, ItemState.ethDeposited); // state does not change 

    }


    function initiateDelivery(uint _tokenId) public onlySeller
    {
        setItemStateByTokenId(_tokenId, ItemState.deliveryInitiated); // also does not change the status... 
    }  


    // 2 seperate functions & who should be able to finalize the sale? 
    function confirmDeliveryFinalizeSale(uint _tokenId) public onlyBuyer {
        
        uint _totalPrice = getTotalPrice(_tokenId);
        IERC721(nft).safeTransferFrom(address(this), buyer, _tokenId); 
        // Transfer ETH to seller 
        seller.transfer(address(this).balance);
        feeAccount.transfer(_totalPrice - items[_tokenId].price);
           // update item state 
        setItemStateByTokenId(_tokenId, ItemState.delivered);
    }
    
      // in the future it would be neat how to handle a dispute - another function needed for that I guess 

    function getTotalPrice(uint _tokenId) view public returns(uint){
        return((items[_tokenId].price*(100 + feePercent))/100);
    }
}
