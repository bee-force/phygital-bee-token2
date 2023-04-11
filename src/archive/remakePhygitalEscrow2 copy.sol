// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Remake_PhygitalEscrow is ReentrancyGuard {

   // monitors progress - why do we need that? maybe for output in UI 
   enum ItemState {nftDeposited, cancelNFT, ethDeposited, canceledBeforeDelivery, deliveryInitiated, delivered, finalized}

   // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent = 1; // the fee percentage on sales 
    uint public itemCount; 

    address payable public seller;
    // when do we initialise the buyer?
    address payable public buyer;
   

    bool buyerCancel = false;
    bool sellerCancel = false;

    // these 2 are saved in items also, so they could be redundant but I am keeping them for now
    uint256 tokenID;
    IERC721 nft;

    // do I still need this? - only if I use it without the Item
    // ContractState public contractState;

    // struct can is like a container that can hold several variables of different datatypes, simliar to a class in OOP without methods or inheritance
    struct Item {
        uint tokenId;
        IERC721 nft;
        uint price;
        address payable seller;
        bool sold;
        ItemState state;
        uint itemId;
    }

    // example: Item bool = true;
 
    // itemId -> Item - mapping in solidity: key-calue pairs: uint is the key and Item the value...
    // public keyword automatically generates a getter function named items() - 
    // any external contract can access the items mapping and retrieve the Item struct associated with a specific uint key by callin the items(uint)
    mapping(uint => Item) public items;
    // uint is uint itemId --> so when I call items[itemId] I will get the corresponding Item

    // now I can access Item storage item = items[_tokenId];


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


    constructor() {
        feeAccount = payable(msg.sender);
    }

    // Make item to offer on the marketplace - is like my previous depositNFT into Escrow 
    // --> as soon as you deposit your nft into escrow its in on the market I guess 
        function ListNFT(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        //require(_price > 0, "Price must be greater than zero");
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
        items[_tokenId] = Item (
            _tokenId,
            _nft,
            _price,
            payable(msg.sender),
            false,
            ItemState.nftDeposited,
            itemCount
        );
    }

    function reverseNftTransfer(uint _tokenId) public onlySeller {
    
    IERC721(nft).safeTransferFrom(address(this), seller, tokenID);
    Item storage item = items[_tokenId];
    item.state = ItemState.cancelNFT;
    //remove the item from the items mapping
    // delete items[itemId]; - instead of the state? with the state we keep all items ever created, maybe it is better to remove them 
    }



     // both seller and buyer can cancel before delivery (there is already ETH in contract)
    function cancelBeforeDelivery(uint _tokenId) public BuyerOrSeller
    {
        // if one cancels, then nft get transferred back to original owner (then owner needs to list once again) and so does the ETH 
            IERC721(nft).safeTransferFrom(address(this), seller, _tokenId);
            
            buyer.transfer(address(this).balance);
            
            Item storage item = items[_tokenId];
            // update item to not sold
            item.sold = false;
            item.state = ItemState.canceledBeforeDelivery; // update the state of the item 
            // or delete it... 
            // Emit an event to indicate that the state of the item has changed
            //emit ItemStateChanged(item.itemId, _tokenId, _newState);  

        }

    // for some reason only an approved account can buy - if I call it via escrow... maybe do a double approve?? 
    // buying works within my react application but not on etherscan, I guess because of the way I am calling the function 
    function depositETH(uint _tokenId) public payable
    {    
        buyer = payable(msg.sender);
        uint _totalPrice = getTotalPrice(_tokenId);
        Item storage item = items[_tokenId];
        
        require(!item.sold, "item already sold");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        
        // update item to sold 
        item.sold = true;
        item.state = ItemState.ethDeposited;

    }

    
    // how does the seller know if ETH was deposited? (its visible on etherscan - is it?)
    // only the seller address can initiate this step 
    function initiateDelivery(uint _tokenId) public onlySeller noDispute
    {
        // maybe return something in the future? 
        // implement require statements maybe checking the current state - that 
        Item storage item = items[_tokenId];
        item.state = ItemState.deliveryInitiated;
    }  

     // only buyer can confirm this step  (in future type in NFC tag number?)
     // should there be another step? NFC logic maybe... 
    function confirmDelivery(uint _tokenId) public onlyBuyer
    {
        Item storage item = items[_tokenId];
        // update item state 
        item.state = ItemState.delivered;
        // at this point we could drop an item in the list?

    }

    // who should finalize it? or keep it in confirm delivery? mhhhh
    function finalizeSale(uint _tokenId) public onlySeller {
        
        Item storage item = items[_tokenId];
        uint _totalPrice = getTotalPrice(_tokenId);
        // Transfer NFT to buyer
        IERC721(nft).safeTransferFrom(address(this), buyer, _tokenId);
        // Transfer ETH to seller 
        seller.transfer(address(this).balance);
        feeAccount.transfer(_totalPrice - item.price);

        item.state = ItemState.finalized;
    }
    
    function getTotalPrice(uint _tokenId) view public returns(uint){
        return((items[_tokenId].price*(100 + feePercent))/100);
    }
}
