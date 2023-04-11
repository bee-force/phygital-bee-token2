// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract remakePhygitalEscrow2 is ReentrancyGuard {

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
    
    //Item storage item = items[_tokenId];
    IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
    //IERC721(items[_tokenId].nft).safeTransferFrom(address(this), seller, _tokenId); 
    items[_tokenId].state = ItemState.cancelNFT;
    // IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
    //item.state = ItemState.cancelNFT;
    // remove the item from the items mapping
    // delete items[itemId]; - instead of the state? with the state we keep all items ever created, maybe it is better to remove them 
    }

    function cancelBeforeDelivery(uint _tokenId) public BuyerOrSeller
    {
        //Item storage item = items[_tokenId];
        // update item to not sold
       //item.sold = false;
        //item.state = ItemState.canceledBeforeDelivery; // update the state of the item 
        items[_tokenId].state = ItemState.canceledBeforeDelivery;
        items[_tokenId].sold = false;
        // or delete it... 
        // Emit an event to indicate that the state of the item has changed
        //emit ItemStateChanged(item.itemId, _tokenId, _newState);  
        // IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
        IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
        buyer.transfer(address(this).balance);
        }


    event ItemSold(uint indexed itemId, address indexed buyer, uint totalPrice);

    function depositETH(uint _tokenId) public payable
    {    
       
        buyer = payable(msg.sender); // buyer is set here
        Item storage item = items[_tokenId];
        uint _totalPrice = getTotalPrice(_tokenId);
       
        //require(!item.sold, "item already sold");
        // forgot to pass the price, this could result in an error right? - msg.value is the amount
        // if this was not true then I would get an error message
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        
        // update item to sold 
        item.sold = true;
        item.state = ItemState.ethDeposited;
        //items[_tokenId].state = ItemState.ethDeposited;
        //items[_tokenId].sold = true;
        emit ItemSold(_tokenId, buyer, _totalPrice);

    }


    function initiateDelivery(uint _tokenId) public onlySeller
    {
        // maybe return something in the future? 
        // maybe require sth? 
        // implement require statements maybe checking the current state - that 
        //Item storage item = items[_tokenId];
        //item.state = ItemState.deliveryInitiated;
        items[_tokenId].state = ItemState.deliveryInitiated;
    }  


    // 2 seperate functions & who should be able to finalize the sale? 
    function confirmDeliveryFinalizeSale(uint _tokenId) public onlyBuyer {
        
        //Item storage item = items[_tokenId];
        // at this point we could drop an item in the list?
        uint _totalPrice = getTotalPrice(_tokenId);
        // Transfer NFT to buyer
        //IERC721(nft).safeTransferFrom(address(this), buyer, _tokenId);
        //IERC721(item.nft).safeTransferFrom(address(this), buyer, _tokenId);
        IERC721(nft).safeTransferFrom(address(this), buyer, _tokenId); 
        // Transfer ETH to seller 
        seller.transfer(address(this).balance);
        feeAccount.transfer(_totalPrice - items[_tokenId].price);
           // update item state 
        items[_tokenId].state = ItemState.delivered;
    }
    
      // in the future it would be neat how to handle a dispute - another function needed for that I guess 

    function getTotalPrice(uint _tokenId) view public returns(uint){
        return((items[_tokenId].price*(100 + feePercent))/100);
    }
}
