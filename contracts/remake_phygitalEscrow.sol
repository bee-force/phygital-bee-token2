// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Remake_PhygitalEscrow is ReentrancyGuard {

   // monitors progress - why do we need that? maybe for output in UI 
   enum ContractState {newEscrow, nftDeposited, cancelNFT, ethDeposited, canceledBeforeDelivery, deliveryInitiated, delivered}

   // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent = 1; // the fee percentage on sales 
    uint public itemCount; 

    address payable public seller;
    // when do we initialise the buyer?
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

   // when & how do we use this? check marketplace 
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
    function reverseNftTransfer(uint _tokenID) public inContractState(ContractState.nftDeposited) onlySeller {
        tokenID = _tokenID;
        IERC721(nft).safeTransferFrom(address(this), msg.sender, tokenID);
        contractState = ContractState.cancelNFT;
    }

     // both seller and buyer can cancel before delivery (there is already ETH in contract)
    function cancelBeforeDelivery(uint _tokenID) public inContractState(ContractState.ethDeposited) BuyerOrSeller
    {
        // if one cancels, then nft get transferred back to original owner (then owner needs to list once again) and so does the ETH 
            IERC721(nft).safeTransferFrom(address(this), seller, tokenID);
            
            buyer.transfer(address(this).balance);
            
            Item storage item = items[_tokenID];
            // update item to not sold
            item.sold = false;
            
            contractState = ContractState.canceledBeforeDelivery;     
        }

    // for some reason only an approved account can buy - if I call it via escrow... maybe do a double approve?? 
    // buying works within my react application but not on etherscan, I guess because of the way I am calling the function 
    function depositETH(uint _tokenId) public inContractState(ContractState.nftDeposited) payable
    {    
        buyer = payable(msg.sender);
        Item storage item = items[_tokenId];
        // update item to sold
        item.sold = true;

        // later check if amount is correct & if token is even buyable?
        // uint _totalPrice = getTotalPrice(_tokenId);
        //require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");

        // emit Bought event
        emit Bought(
            item.itemId,
            address(item.nft),
            _tokenId,
            item.price,
            item.seller,
            msg.sender
        );

        contractState = ContractState.ethDeposited;
    }

   // --> Inspiration for improvement
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

    
    // how does the seller know if ETH was deposited? (its visible on etherscan - is it?)
    // only the seller address can initiate this step 
    function initiateDelivery() public inContractState(ContractState.ethDeposited) onlySeller noDispute
    {
        // maybe return something in the future? 
        // implement require statements maybe checking the current state - that 
        contractState = ContractState.deliveryInitiated;
    }  

     // only buyer can confirm this step  (in future type in NFC tag number?)
     // should there be another step? NFC logic maybe... 
    function confirmDelivery(uint tokenId) public inContractState(ContractState.deliveryInitiated) onlyBuyer
    {
        // Transfer NFT to buyer
        IERC721(nft).safeTransferFrom(address(this), buyer, tokenId);
        // Transfer ETH to seller 
        seller.transfer(address(this).balance);
        contractState = ContractState.delivered;

    }

    /* change above function to somethin like this
    // -> Require funds to be correct amount
    // -> Transfer NFT to buyer
    // -> Transfer Funds to Seller
    function finalizeSale(uint256 _nftID) public {
        require(address(this).balance >= purchasePrice[_nftID]);
        //isListed[_nftID] = false;
        (bool success, ) = payable(seller).call{value: address(this).balance}(
            ""
        );
        require(success);
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }*/
    
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
