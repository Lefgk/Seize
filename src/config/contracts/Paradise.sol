// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface Iercdetailed {
     function decimals() external pure returns (uint256) ;
}
contract TieredContribution is Ownable(msg.sender) {
    using SafeERC20 for IERC20; 

    address public usdc = 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E;
    address public client = 0x909200dD5C2D9D3D712F2a43B3e76907240ccF5b;
    address public fee ;
    uint256 public tier1Price;  // Tier 1 price

    uint256 public constant tier1SlotLimit = 30;

    mapping(address => uint256) public tier1Contributions;

    uint256 public totalTier1Contributors;

    event ContributionReceived(address indexed contributor, uint256 amount, uint256 quantity);

    // Constructor to initialize the contract
    constructor(address _feecontract) {
        fee = _feecontract;
        uint256 decimal= Iercdetailed(usdc).decimals();
        tier1Price = 1050 * 10**decimal;  // Tier 1 price
    }

    function changePrice(uint256 price1) public onlyOwner{
        uint256 decimal= Iercdetailed(usdc).decimals();
        tier1Price = price1 * 10 ** decimal;  // Tier 1 price

    }

    function changeClient(address _client) public onlyOwner{
     client = _client;
    }


    // Function to contribute to a specific tier with a quantity
    function contribute(uint256 quantity) public {

        require(quantity > 0, "Quantity must be greater than zero");

        uint256 requiredAmount;

    
        require(totalTier1Contributors + quantity <= tier1SlotLimit, "Tier 1 is full");
        requiredAmount = tier1Price * quantity;
        tier1Contributions[msg.sender] += quantity;

        // Increment the total contributors for Tier 1 by the quantity contributed
        totalTier1Contributors += quantity;
        
        IERC20(usdc).transferFrom(msg.sender,client,90 * requiredAmount/100);
        IERC20(usdc).transferFrom(msg.sender,fee,requiredAmount- 90 * requiredAmount/100);

        // Emit the contribution event with the quantity
        emit ContributionReceived(msg.sender,requiredAmount, quantity);
    }

    // View function to get the price for a specific tier
    function getTierPrice(uint8) public view returns (uint256) {
        return tier1Price;
    }

    // Function to get total contribution for an address in a specific tier
    function getContributionByTier(address _contributor) public view returns (uint256) {
        return tier1Contributions[_contributor];
    }

    // Function to get the total number of contributors in each tier
    function getTotalContributorsPerTier(uint8) public view returns (uint256) {
        return totalTier1Contributors;
    }

         /**
     * @dev Gets all tokens
     */
    function getAll() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /**
     * @dev Get all IBEP20 tokens
     * @param tokenAddr The token address.
     */
    function getAllTokens(address tokenAddr) external onlyOwner {
        IERC20 token = IERC20(tokenAddr);
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(msg.sender, tokenBalance);
    }
}
