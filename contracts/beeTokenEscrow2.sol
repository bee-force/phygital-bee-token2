// SPDX-License-Identifier: MIT
// Specify the license for this smart contract.

pragma solidity ^0.8.4;

// Import OpenZeppelin ERC721 and ReentrancyGuard libraries.
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Import Hardhat console library for debugging purposes.
import "hardhat/console.sol";

// Create a new contract that uses the ReentrancyGuard library.
contract beeTokenEscrow is ReentrancyGuard {
    // Declare an enumeration to keep track of the progress of each escrow transaction.
    enum ItemState {
        NewEscrow,
        NftDeposited,
        CancelNft,
        EthDeposited,
        CanceledBeforeDelivery,
        DeliveryInitiated,
        Delivered
    }

    // Declare variables.
    address payable public immutable feeAccount; // The account that receives fees.
    uint public immutable feePercent = 1; // The fee percentage on sales.
    uint public itemCount; // Number of items in the escrow.

    address payable public seller; // Seller's address.
    address payable public buyer; // Buyer's address.

    // Declare a struct to store each item in the escrow.
    struct Item {
        uint itemId; // The item's ID.
        uint256 tokenId; // The ID of the NFT being sold.
        IERC721 nft; // The address of the NFT's contract.
        uint price; // The item's price in ETH.
        address payable seller; // The seller's address.
        bool sold; // Whether the item has been sold.
        ItemState state; // The state of the item's escrow transaction.
    }

    // Declare a mapping to store each item in the escrow.
    mapping(uint => Item) public items;

    // Constructor that sets the fee account.
    constructor() {
        feeAccount = payable(msg.sender);
    }

    // Modifier that only allows the seller to call a function.
    modifier onlySeller() {
        require(msg.sender == seller);
        _;
    }

    // Modifier that only allows the buyer to call a function.
    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    // Modifier that only allows the buyer or seller to call a function.
    modifier buyerOrSeller() {
        require(msg.sender == buyer || msg.sender == seller);
        _;
    }

    // Function to list an NFT for sale in the escrow.
    function listNFT(
        IERC721 _nft,
        uint256 _tokenId,
        uint _price
    ) external nonReentrant {
        // Increment the item count.
        itemCount++;

        // Set the seller's address.
        seller = payable(msg.sender);

        // Transfer the NFT to the escrow contract.
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        // Initialise the item's struct and mapping.
        items[itemCount] = Item(
            itemCount,
            _tokenId,
            _nft,
            _price,
            payable(msg.sender),
            false,
            ItemState.NftDeposited
        );
    }

  function setItemStateByTokenId(uint256 tokenId, ItemState newState) public {
    for (uint256 i = 1; i <= itemCount; i++) {
        if (items[i].tokenId == tokenId) {
            items[i].state = newState;
            return;
        }
    }
    revert("Item not found for the given tokenId");
}

    // Reverse the transfer of an NFT back to the seller
    function reverseNftTransfer(uint _tokenId) public onlySeller {
        // Transfer the NFT back to the seller
        IERC721(items[_tokenId].nft).safeTransferFrom(
            address(this),
            seller,
            _tokenId
        );
        // Set the item state to CancelNft
        setItemStateByTokenId(_tokenId, ItemState.CancelNft);

        // Transfer the NFT back to the seller
        IERC721(items[_tokenId].nft).safeTransferFrom(
            address(this),
            seller,
            items[_tokenId].tokenId
        );
    }

    // Cancel the sale before delivery
    function cancelBeforeDelivery(uint _tokenId) public buyerOrSeller {
        // Update the item state to CanceledBeforeDelivery
        setItemStateByTokenId(_tokenId, ItemState.CanceledBeforeDelivery);

        // Refund the buyer by transferring the contract's balance to the buyer's address
        payable(buyer).transfer(address(this).balance);

        // Transfer the NFT back to the seller
        IERC721(items[_tokenId].nft).safeTransferFrom(
            address(this),
            seller,
            items[_tokenId].tokenId
        );
    }

    // Deposit ETH for an item
    function depositETH(uint _tokenId) public payable {
        // Set the buyer address to the sender
        buyer = payable(msg.sender);
        // Get the total price for the item
        uint _totalPrice = getTotalPrice(_tokenId);
        // Ensure the sent ETH covers the total price plus market fee
        require(
            msg.value >= _totalPrice,
            "not enough ether to cover item price and market fee"
        );
        setItemStateByTokenId(_tokenId, ItemState.EthDeposited);
    }

    // Initiate delivery of an item
    function initiateDelivery(uint _tokenId) public onlySeller {
        // Set the item state to DeliveryInitiated
        setItemStateByTokenId(_tokenId, ItemState.DeliveryInitiated); 
    }

    // Confirm delivery of an item and finalize the sale
   // Confirm delivery of an item and finalize the sale
function confirmDeliveryFinalizeSale(uint _tokenId) public onlyBuyer {
    // Get a reference to the item
    Item storage item = items[_tokenId];
    // Set the item state to Delivered
    item.state = ItemState.Delivered;
    // Get the total price for the item
    uint _totalPrice = getTotalPrice(_tokenId);
    
    // Calculate the market fee
    uint _fee = (_totalPrice * feePercent) / 100;
    uint _sellerAmount = _totalPrice - _fee;
    
    // If the market fee is negative or zero, set it to 0.01% of the item price
    if (_fee <= 0) {
        _fee = (_totalPrice * 1) / 10000; // 0.01% of the item price
        _sellerAmount = _totalPrice - _fee;
    }

    // Transfer the NFT to the buyer
    IERC721(item.nft).safeTransferFrom(address(this), buyer, item.tokenId);
    
    // Transfer the seller's amount to the seller
    (bool sellerSuccess, ) = item.seller.call{value: _sellerAmount}("");
    require(sellerSuccess, "Failed to send seller amount");
    
    // Transfer the market fee to the feeAccount
    (bool feeSuccess, ) = feeAccount.call{value: _fee}("");
    require(feeSuccess, "Failed to send market fee");
}


    function getTotalPrice(uint _tokenId) public view returns (uint) {
        return ((items[_tokenId].price * (100 + feePercent)) / 100);
    }
}
