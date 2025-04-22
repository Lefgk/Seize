// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface Iercdetailed {
     function decimals() external pure returns (uint256) ;
}
contract TieredContribution is Ownable(msg.sender) {
    using SafeERC20 for IERC20; 

    address public usdc = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public client = 0x909200dD5C2D9D3D712F2a43B3e76907240ccF5b;
    address public fee ;
    uint256 public tier1Price;  // Tier 1 price
    uint256 public tier2Price;  // Tier 2 price
    uint256 public tier3Price ; // Tier 3 price

    uint256 public constant tier1SlotLimit = 300;
    uint256 public constant tier2SlotLimit = 200;
    uint256 public constant tier3SlotLimit = 100;

    mapping(address => uint256) public tier1Contributions;
    mapping(address => uint256) public tier2Contributions;
    mapping(address => uint256) public tier3Contributions;

    uint256 public totalTier1Contributors;
    uint256 public totalTier2Contributors;
    uint256 public totalTier3Contributors;

    event ContributionReceived(address indexed contributor, uint256 amount, uint8 tier, uint256 quantity);

    // Constructor to initialize the contract
    constructor(address _feecontract) {
        fee = _feecontract;
        uint256 decimal= Iercdetailed(usdc).decimals();
        tier1Price = 50 * 10**decimal;  // Tier 1 price
        tier2Price = 100 * 10**decimal;  // Tier 2 price
        tier3Price = 150 * 10**decimal;    // Tier 3 price
    }

    function changePrice(uint256 price1, uint256 price2, uint256 price3) public onlyOwner{
        uint256 decimal= Iercdetailed(usdc).decimals();
        tier1Price = price1 * 10 ** decimal;  // Tier 1 price
        tier2Price = price2 * 10 ** decimal;  // Tier 2 price
        tier3Price = price3 * 10 ** decimal;    // Tier 3 price
    }

    // Function to contribute to a specific tier with a quantity
    function contribute(uint8 tier, uint256 quantity) public {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(quantity > 0, "Quantity must be greater than zero");

        uint256 requiredAmount;

        if (tier == 1) {
            require(totalTier1Contributors + quantity <= tier1SlotLimit, "Tier 1 is full");
            requiredAmount = tier1Price * quantity;
            tier1Contributions[msg.sender] += quantity;

            // Increment the total contributors for Tier 1 by the quantity contributed
            totalTier1Contributors += quantity;

        } else if (tier == 2) {
            require(totalTier2Contributors + quantity <= tier2SlotLimit, "Tier 2 is full");
            requiredAmount = tier2Price * quantity;
            tier2Contributions[msg.sender] += quantity;

            // Increment the total contributors for Tier 2 by the quantity contributed
            totalTier2Contributors += quantity;

        } else if (tier == 3) {
            require(totalTier3Contributors + quantity <= tier3SlotLimit, "Tier 3 is full");
            requiredAmount = tier3Price * quantity;
            tier3Contributions[msg.sender] += quantity;

            // Increment the total contributors for Tier 3 by the quantity contributed
            totalTier3Contributors += quantity;
        }

        
        IERC20(usdc).transferFrom(msg.sender,client,90 * requiredAmount/100);
        IERC20(usdc).transferFrom(msg.sender,fee,requiredAmount- 90 * requiredAmount/100);

        // Emit the contribution event with the quantity
        emit ContributionReceived(msg.sender,requiredAmount, tier, quantity);
    }

    // View function to get the price for a specific tier
    function getTierPrice(uint8 tier) public view returns (uint256) {
        if (tier == 1) {
            return tier1Price;
        } else if (tier == 2) {
            return tier2Price;
        } else if (tier == 3) {
            return tier3Price;
        } else {
            revert("Invalid tier");
        }
    }

    // Function to get total contribution for an address in a specific tier
    function getContributionByTier(address _contributor, uint8 tier) public view returns (uint256) {
        if (tier == 1) {
            return tier1Contributions[_contributor];
        } else if (tier == 2) {
            return tier2Contributions[_contributor];
        } else if (tier == 3) {
            return tier3Contributions[_contributor];
        } else {
            revert("Invalid tier");
        }
    }

    // Function to get the total number of contributors in each tier
    function getTotalContributorsPerTier(uint8 tier) public view returns (uint256) {
        if (tier == 1) {
            return totalTier1Contributors;
        } else if (tier == 2) {
            return totalTier2Contributors;
        } else if (tier == 3) {
            return totalTier3Contributors;
        } else {
            revert("Invalid tier");
        }
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
