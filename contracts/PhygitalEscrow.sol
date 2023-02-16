// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract PhygitalEscrow is ReentrancyGuard {

   // monitors progress - why do we need that? maybe for output in UI 
   enum ContractState {newEscrow, nftDeposited, cancelNFT, ethDeposited, canceledBeforeDelivery, deliveryInitiated, delivered}

   // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent = 5; // the fee percentage on sales 
    uint public itemCount; 

    // I think this was not saved 
    address payable public seller;
    address payable public buyer;
    IERC721 nft;

    bool buyerCancel = false;
    bool sellerCancel = false;

    uint256 tokenID;

    ContractState public contractState;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // modifiers throw exceptions when defined conditions are not met in the functions they are used in    
    // not sure what the first modifier does
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
	
	modifier noDispute(){
	    require(buyerCancel == false && sellerCancel == false);
	    _;
	}
	
	modifier BuyerOrSeller() {
		require(msg.sender == buyer || msg.sender == seller);
		_;
	}
	
	modifier inContractState(ContractState _state) {
		require(contractState == _state);
		_;
	}


    constructor() {
        feeAccount = payable(msg.sender);
        contractState = ContractState.newEscrow;
    }

    // Make item to offer on the marketplace - is like my previous depositNFT into Escrow 
    // --> as soon as you deposit your nft into escrow its in on the market I guess 
        function ListNFT(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // set the id here too
        tokenID = _tokenId;
        //set NFT contract too
        nft = _nft;
        // set seller too 
        seller = payable(msg.sender);
        // transfer nft - in future I would actually not want to transfer nft instantly - possible to only list? 
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );

        contractState = ContractState.nftDeposited;
    }

    // this cancels the transferal, rather reverts its & the seller is owner once again 
    function reverseNftTransfer()
        public
        inContractState(ContractState.nftDeposited)
        onlySeller
    {
        IERC721(nft).safeTransferFrom(address(this), msg.sender, tokenID);
        contractState = ContractState.cancelNFT;
    }

    /*function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }*/

     // both seller and buyer can cancel before delivery (there is already ETH in contract)
    function cancelBeforeDelivery(bool _state)
        public
        inContractState(ContractState.ethDeposited)
        payable
        BuyerOrSeller
    {
        if (msg.sender == seller){
            sellerCancel = _state;
        }
        else{
            buyerCancel = _state;
        }
        
        // if both cancel, then nft get transferred back and so does the ETH 
        if (sellerCancel == true && buyerCancel == true){
            IERC721(nft).safeTransferFrom(address(this), seller, tokenID);
            buyer.transfer(address(this).balance);
            contractState = ContractState.canceledBeforeDelivery;     
        }
    }

    function depositETH()
        public
        payable
        inContractState(ContractState.nftDeposited)
    {
        buyer = payable(msg.sender);
        contractState = ContractState.ethDeposited;
    }
    
       // how does the seller know if ETH was deposited? (its visible on etherscan)

    // only the seller address can initiate this step 
    function initiateDelivery()
        public
        inContractState(ContractState.ethDeposited)
        onlySeller
        noDispute
    {
        contractState = ContractState.deliveryInitiated;
    }  

     // only buyer can confirm this step  (in future type in NFC tag number?)
    // why do we need to pass in ETH for this function?
    function confirmDelivery() 
        public
        payable 
        inContractState(ContractState.deliveryInitiated)
        onlyBuyer
    {
        // Token will be transferred to buyer address 
        IERC721(nft).safeTransferFrom(address(this), buyer, tokenID);
        seller.transfer(address(this).balance);
        contractState = ContractState.delivered;
    }


    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
