// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Campaign.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

interface IDecimals {
    /**
     * @dev Returns the number of decimals used to get the token's user representation.
     * Typically used for ERC-20 tokens.
     */
    function decimals() external view returns (uint8);
}

//base usdc
contract CampaignFactory is Ownable(msg.sender) {

    uint public Fee;
    address public feeContract = 0x0745DB12c2faab740DA09f69310B5b9604A6FFff; 
    address public grantwallet = 0xE058341eb9259d2F94B40e633dB405797b85371C;
    address public PlatformmultiSigWallet = 0xaF5618F837cD403f42224A8A4e29EFB629620CD4; 
    address public USDC;
    address public WETH;
    address public router;
    uint256 public totalCampaigns; // Total number of campaigns created
    uint256 public totalRaised; 
    uint256 public totalRaisedUSDC; 
    uint256 public ended;
    string public constant version = "v1";

    Campaign[] public campaigns;
    mapping(string => address) public campaignsByTitle;
    mapping(address => Campaign[]) public campaignsByCreator; 
    mapping(address => address[]) public campaignsByContributor;
    mapping(address => bool) public admins; 
    mapping(address => bool) public registeredCampaigns;

    mapping(address => bool) private recoveryApprovals; // Tracks admin approvals
    uint256 private approvalCount; // Tracks number of approvals for recovery
    
    struct CampaignParams {
        string category;
        uint endTime;
        uint goalAmount;
        uint maxDeposits;
        address token;
        string title;
        string website;

    }
    event CampaignCreated(uint campaignId, address campaignAddress);
    event FeeChanged(uint newFee);
    event AdminAdded(address admin);
    event AdminRemoved(address admin);

/* base
    USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    router = 0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb;
    WETH = 0x4200000000000000000000000000000000000006;
*/

/* avax
    USDC = 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E;
    router = 0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;
    WETH = 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7;
*/

/* pulsechain
    USDC = 0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07;
    router = 0x165C3410fC91EF562C50559f7d2289fEbed552d9;
    WETH = 0xA1077a294dDE1B09bB078844df40758a5D0f9a27;
*/

  /* sei
        USDC = 0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1;
        router = 0x9f3B1c6b0CDDfE7ADAdd7aadf72273b38eFF0ebC;
        WETH = 0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7;
    */

    constructor() {
    USDC = 0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07;
    router = 0x165C3410fC91EF562C50559f7d2289fEbed552d9;
    WETH = 0xA1077a294dDE1B09bB078844df40758a5D0f9a27;

        addAdmin(msg.sender);
        addAdmin(grantwallet);
        addAdmin(PlatformmultiSigWallet);
        addAdmin(0x7249836F0feCAF96D6f61Ae521Ad9e736E8e571F); //buff
        addAdmin(0x2Ed087297C56F469c033FF2188a5916F4478063c); //tdot
        uint256 decimals=IDecimals(USDC).decimals();
        Fee = 15 *10**decimals;//TODO
       
    }

    /**
     * @notice Gives eth worth of Fee
     */
    function getETHForUSDC() public view returns (uint256) {

        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = WETH;

        uint256[] memory amounts = IUniswapV2Router02(router).getAmountsOut(Fee, path);
        return amounts[1]; 
    }

    /**
     * @notice Returns total raised in USDC
     */
    function getTotalRaisedinUSDC() external view returns (uint256 _totalraised) {
        if (totalRaised == 0) return totalRaisedUSDC;
        
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDC;

        uint256[] memory amounts = IUniswapV2Router02(router).getAmountsOut(totalRaised, path);
     
        _totalraised = totalRaisedUSDC + amounts[1];
    }
   

    /**
     * @notice Function to create a new campaign contract 
     * @param params Campaign details
     */
    function createCampaign(CampaignParams calldata params) external payable {
        require(msg.value == getETHForUSDC(), "Must pay the creation fee");
        require(
            campaignsByTitle[params.title] == address(0),
            "A campaign with this title already exists"
        );

        require(
            params.goalAmount > 0,
            "Deposit amount must be greater than zero"
        );

        Campaign newCampaign = (new Campaign)(
            Campaign.CampaignDetails({
                creator: msg.sender,
                goalAmount: params.goalAmount,
                endTime: uint32(block.timestamp + params.endTime),
                title: params.title,
                category: params.category,
                website: params.website,
            
                token: params.token,
                maxDeposits: params.maxDeposits
            }),
            feeContract,
            PlatformmultiSigWallet,
            address(this)
        );

       
        totalCampaigns++;
        campaigns.push(newCampaign);
        campaignsByTitle[params.title] = address(newCampaign);
        campaignsByCreator[msg.sender].push(newCampaign);
        registeredCampaigns[address(newCampaign)] = true;

        (bool success, ) = grantwallet.call{value: msg.value}("");
        require(success, "fee tx failed");

        emit CampaignCreated(campaigns.length, address(newCampaign));
    }

    /**
     * @notice Function to change the initial contribution
     * @param _Fee  new Fee in USDC
     */
    function changeFee(uint256 _Fee) external onlyOwner {
        Fee = _Fee;
        emit FeeChanged(Fee);
    }

    /**
     * @notice Returns campaign info by title
     * @param _title title of the campaign
     */
    function getCampaignByTitle(
        string calldata _title
    ) external view returns (Campaign.FullCampaignDetails memory) {
        address campaignAddress = campaignsByTitle[_title];
        require(
            campaignAddress != address(0),
            "No campaign found with this title"
        );

        // Cast campaign address to the Campaign contract and fetch details
        Campaign campaign = Campaign(payable(campaignAddress));
        return campaign.getCampaignDetails();
    }

    /**
     * @notice change swap router
     * @param _router the new router
     */
    function changeRouter(address _router) public onlyOwner {
        require(_router != address(0), "Invalid router address");
        router = _router;
    }

    /**
     * @notice Adds a new admin to the contract
     * @param _admin The address to be added as an admin
     */
    function addAdmin(address _admin) public onlyOwner {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    /**
     * @notice Removes an admin from the contract
     * @param _admin The address to be removed as an admin
     */
    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

  /**
     * @notice Checks if an address is an admin
     * @param _addr The address to check
     * @return True if the address is an admin, false otherwise
     */
    function isAdmin(address _addr) external view returns (bool) {
        return admins[_addr];
    }

/**
     * @notice Gets the number of campaigns created by a specific address
     * @param creator The address of the campaign creator
     * @return The number of campaigns created by the address
     */
    function getNumCampaignsByCreator(
        address creator
    ) external view returns (uint) {
        return campaignsByCreator[creator].length;
    }

    /**
     * @notice Gets the number of campaigns a user has invested in
     * @param contributor The address of the contributor
     * @return The number of campaigns invested by the user
     */
    function getNumCampaignsInvestedByUser(address contributor) external view returns (uint256) {
        return campaignsByContributor[contributor].length;
    }

  /**
     * @notice Updates the total raised amount in the contract
     * @param amount The amount to be added to the total raised
     */
    function updateTotalRaised(uint256 amount) external {
        require(
            registeredCampaigns[msg.sender],
            "Caller is not a valid campaign"
        );
        totalRaised += amount;
    }

   /**
     * @notice Updates the total USDC raised amount in the contract
     * @param amount The amount to be added to the total USDC raised
     */
    function updateTotalRaisedUSDC(uint256 amount) external {
        require(
            registeredCampaigns[msg.sender],
            "Caller is not a valid campaign"
        );
        totalRaisedUSDC += amount;
    }

   /**
     * @notice Increments the count of ended campaigns
     */
      function updateEnded() external {
        require(
            registeredCampaigns[msg.sender],
            "Caller is not a valid campaign"
        );
        ended++;
    }

   /**
     * @notice Updates the list of campaigns contributed to by a user
     * @param _contributor The address of the contributor
     * @param _campaign The address of the campaign
     */
    function updateContributed(address _contributor, address _campaign) external {
        require(
            registeredCampaigns[msg.sender],
            "Caller is not a valid campaign"
        );
        campaignsByContributor[_contributor].push(_campaign);
    }

/**
     * @notice Retrieves campaigns created by a user within a specified range
     * @param creator The address of the campaign creator
     * @param startIndex The start index of the campaigns
     * @param endIndex The end index of the campaigns
     * @return An array of campaign details
     */
    function getCampaignsCreatedByUserInRange(
        address creator,
        uint256 startIndex,
        uint256 endIndex
    ) external view returns (Campaign.FullCampaignDetails[] memory) {
        uint256 numCampaigns = campaignsByCreator[creator].length;
        require(endIndex >= startIndex, "End index must be >= start index");
        require(endIndex < numCampaigns, "End index out of bounds");

        uint256 count = endIndex - startIndex + 1;
        Campaign.FullCampaignDetails[] memory campaignDetailsArray = new Campaign.FullCampaignDetails[](count);

        for (uint256 i; i < count;) {
            uint256 index = startIndex + i;
            Campaign campaign = campaignsByCreator[creator][index];
            campaignDetailsArray[i] = campaign.getCampaignDetails();
              unchecked{
                i++;
            }
        }

        return campaignDetailsArray;
    }

  /**
     * @notice Retrieves campaigns invested by a user within a specified range
     * @param contributor The address of the contributor
     * @param startIndex The start index of the campaigns
     * @param endIndex The end index of the campaigns
     * @return An array of campaign details
     */
    function getCampaignsInvestedByUserInRange(
        address contributor,
        uint256 startIndex,
        uint256 endIndex
    ) external view returns (Campaign.FullCampaignDetails[] memory) {
        uint256 numCampaigns = campaignsByContributor[contributor].length;
        require(endIndex >= startIndex, "End index must be >= start index");
        require(endIndex < numCampaigns, "End index out of bounds");

        uint256 count = endIndex - startIndex + 1;
        Campaign.FullCampaignDetails[] memory campaignDetailsArray = new Campaign.FullCampaignDetails[](count);

        for (uint256 i ; i < count;) {
            uint256 index = startIndex + i;
            Campaign campaign = Campaign(payable(campaignsByContributor[contributor][index]));
            campaignDetailsArray[i] = campaign.getCampaignDetails();
            unchecked{
                i++;
            }
        }

        return campaignDetailsArray;
    }

  /**
     * @notice Retrieves campaigns within a specified range, filtered by case
     * @param _startIndex The start index of the campaigns
     * @param _endIndex The end index of the campaigns
     * @param _case Filter type: 0 = all, 1 = active, 2 = inactive
     * @return An array of campaign details
     */
    function getCampaignsInRange(
        uint _startIndex,
        uint _endIndex,
        uint _case
    ) external view returns (Campaign.FullCampaignDetails[] memory) {
        require(_endIndex >= _startIndex, "End index must be >= start index");
        require(_endIndex < totalCampaigns, "End index out of bounds");

        uint targetCount = _endIndex - _startIndex + 1;
        uint maxActiveCampaigns = totalCampaigns - ended; // Active campaigns count
        uint maxInactiveCampaigns = ended; // Inactive campaigns count

        if (_case == 1) {
            require(targetCount <= maxActiveCampaigns, "Not enough active campaigns");
        } else if (_case == 2) {
            require(targetCount <= maxInactiveCampaigns, "Not enough inactive campaigns");
        }

        Campaign.FullCampaignDetails[] memory selectedCampaigns = new Campaign.FullCampaignDetails[](targetCount);
        uint validCount;

        for (uint i; i < totalCampaigns && validCount < targetCount;) {
            Campaign campaign = Campaign(payable(campaigns[i]));

            if (
                _case == 0 || // Include all campaigns
                (_case == 1 && campaign.isActive()) || // Include only active campaigns
                (_case == 2 && !campaign.isActive()) // Include only inactive campaigns
            ) {
                if (validCount >= _startIndex) {
                    selectedCampaigns[validCount - _startIndex] = campaign.getCampaignDetails();
                }
                validCount++;
            }

            unchecked {
                i++;
            }
        }

        return selectedCampaigns;
    }

    /**
     * @notice Updates the address of the fee contract
     * @param _newFeeContract The new address for the fee contract
     */
    function changeFeeContract(address _newFeeContract) external onlyOwner {
        require(_newFeeContract != address(0), "Invalid address");
        feeContract = _newFeeContract;
    }

    /**
     * @notice Updates the address of the grant wallet
     * @param _newGrantWallet The new address for the grant wallet
     */
    function changeGrantWallet(address _newGrantWallet) external onlyOwner {
        require(_newGrantWallet != address(0), "Invalid address");
        grantwallet = _newGrantWallet;
    }

    /**
     * @notice Updates the address of the platform multisig wallet
     * @param _newPlatformWallet The new address for the platform multisig wallet
     */
    function changePlatformWallet(address _newPlatformWallet) external onlyOwner {
        require(_newPlatformWallet != address(0), "Invalid address");
        PlatformmultiSigWallet = _newPlatformWallet;
    }



    /**
    * @notice Allows an admin to approve the recovery process
    */
    function approveRecovery() external {
        require(admins[msg.sender], "Only admins can approve recovery");
        require(!recoveryApprovals[msg.sender], "Admin has already approved");
        recoveryApprovals[msg.sender] = true;
        approvalCount++;
    }

    function disapproveRecovery() external {
        require(admins[msg.sender], "Only admins can disapprove recovery");
        require(recoveryApprovals[msg.sender], "Admin has not approved yet");

        recoveryApprovals[msg.sender] = false;
        approvalCount--;
    }

    function recovery() public view returns (bool isRecover){
        if (approvalCount>=3) {
            isRecover=true;}
    }
            
    }
