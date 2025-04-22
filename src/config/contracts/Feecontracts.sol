// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FeeSplitter is Ownable(msg.sender) {
    using SafeERC20 for IERC20; 

    struct Wallet {
        address walletAddress;
        uint256 percentage; 
    }

    Wallet[] public wallets;
    IERC20 public usdcToken;

    event FundsDistributed(uint256 isUSdc, uint256 totalAmount);
    event WalletReplaced(uint256 index, address oldWallet, address newWallet, uint256 percentage);

    constructor() {
        usdcToken = IERC20(0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07);
        wallets.push(Wallet(0x5345675315AA194bB75B403707532758753ACd00, 6)); 
        wallets.push(Wallet(0x501d7e2229D9E7b67582e35F41a8a8e7b8d1c897, 1)); 
        wallets.push(Wallet(0xEB0AD6A701396ef5133f1A8525F5789B9Dd846c1, 5)); 
        wallets.push(Wallet(0xb60e97ec1486d14c81d4147cCF3b12895B5D4ce1, 5));  
        wallets.push(Wallet(0xdB8cAEbCD48E77aC4337338B9fFab6Ccc1e5534F, 5)); 
        wallets.push(Wallet(0x887f416816e9dF65983d2e99F7616Ef0CaC1F56D, 2)); 
        wallets.push(Wallet(0x909200dD5C2D9D3D712F2a43B3e76907240ccF5b, 10)); 
        wallets.push(Wallet(0x2Ed087297C56F469c033FF2188a5916F4478063c, 16)); 
        wallets.push(Wallet(0xb9BdbffCD8704788F11125B78607818c2DE3E85C, 3)); 
        wallets.push(Wallet(0xD0D3D4E5c6604Bf032412A79f8A178782b54B88b, 15)); 
        wallets.push(Wallet(0x4D3647eb56198126e6b9040AE252Cc08067f1cc1, 16)); 
        wallets.push(Wallet(0x7249836F0feCAF96D6f61Ae521Ad9e736E8e571F, 16));
    }

    receive() external payable {}

    function distributeBoth() public {
        distribute();
        distributeUsdc();
    }
    
    function changeUSDC(address _usdc) public onlyOwner {
        usdcToken = IERC20(_usdc);
    }

    function distribute() public payable {
        uint256 contractBalance = address(this).balance;
        if (contractBalance==0)return;
        bool success;
        for (uint256 i; i < 12;) {
            uint256 amount = (contractBalance * wallets[i].percentage) / 100;
            (success, )  = wallets[i].walletAddress.call{value: amount}("");
            require(success, "Transfer failed");
            unchecked{
            i++;
        }
        }
        emit FundsDistributed(1,contractBalance);
    }

     function distributeUsdc() public {
        uint256 contractBalance = usdcToken.balanceOf(address(this));
        if (contractBalance==0) return;

        for (uint256 i; i < 12;) {
            uint256 amount = (contractBalance * wallets[i].percentage) / 100;
            usdcToken.safeTransfer(wallets[i].walletAddress, amount);
            unchecked {
                i++;
            }
        }

        emit FundsDistributed(0, contractBalance);
    }

    // Function to get wallet details by index
    function getWallet(uint256 index) external view returns (address walletAddress, uint256 percentage) {
        require(index < wallets.length, "Index out of bounds");
        Wallet storage wallet = wallets[index];
        return (wallet.walletAddress, wallet.percentage);
    }

     function replaceWallet(uint256 index, address newWallet, uint256 newPercentage) external onlyOwner {
        require(index < wallets.length, "Index out of bounds");
        require(newWallet != address(0), "Invalid new wallet address");

        uint256 totalPercentage = 0;

        // Calculate total percentage after replacement
        for (uint256 i; i < wallets.length; i++) {
            if (i == index) {
                totalPercentage += newPercentage;
            } else {
                totalPercentage += wallets[i].percentage;
            }
        }

        require(totalPercentage == 100, "Total percentage must equal 100");

        address oldWallet = wallets[index].walletAddress;
        wallets[index] = Wallet(newWallet, newPercentage);

        emit WalletReplaced(index, oldWallet, newWallet, newPercentage);
    }
}
