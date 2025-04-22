// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface iCampaignFactory {
    function isAdmin(address _addr) external view returns (bool);
    function updateTotalRaised(uint amount) external;
    function updateTotalRaisedUSDC(uint amount) external;
    function updateEnded() external;
    function updateContributed(
        address _contributor,
        address _campaign
    ) external;
    function recovery() external view returns (bool);
}

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Campaign {
    using SafeERC20 for IERC20; 
    struct FullCampaignDetails {
        address campaignAddress;
        address creator;
        uint goalAmount;
        uint32 creationTime;
        uint32 endTime;
        string title;
        string category;
        string website;
        address token;
        uint maxDeposits;
        bool isActive;
        uint256 contributors;
        bool extensionRequested;
        bool extensionApproved;
        uint256 Totalcontributions;
    }

    struct CampaignDetails {
        address creator;
        uint goalAmount; //if donation this is total to raise. If investment its min amount
        uint32 endTime;
        string title;
        string category;
        string website;
        address token;
        uint maxDeposits; //if donation this is 0, this is how we can tell if a c is donation. IF investment its no. of packages
    }

    CampaignDetails public campaign;
    bool public isActive = true;
    bool public isLLC;
    address public feeContract;
    address public PlatformmultiSigWallet;
    address public factoryAddress;
    string public constant version = "v1";
    mapping(address => uint) public contributions;
    mapping(address => bool) public hasClaimedRefund; // Track claimed refunds for users
    uint256 public contributors;
    uint256 public Totalcontributions;

    bool public extensionRequested; // Tracks if an extension has been requested
    bool public extensionApproved; // Tracks if an extension has been approved
    uint32 public creationTime;
    event ContributionReceived(address contributor, uint amount);
    event CampaignCancelled(address campaign);
    event FundsReleased(uint amount);
    event PayCreator(address indexed campaign, address indexed creator, uint amount);
    event RefundClaimed(address contributor, uint amount);
    event ExtensionRequested(
        address indexed requester,
        address indexed campaign
    );
    event ExtensionApproved(address admin);

    modifier onlyCreator() {
        require(
            msg.sender == campaign.creator,
            "Only creator"
        );
        _;
    }
    modifier onlyCreatororAdmin() {
        require(
            msg.sender == campaign.creator ||
                iCampaignFactory(factoryAddress).isAdmin(msg.sender),
            "Only creator or admin"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            iCampaignFactory(factoryAddress).isAdmin(msg.sender),
            "Only admin"
        );
        _;
    }

    constructor(
        CampaignDetails memory _campaignDetails,
        address _feeContract,
        address _PlatformmultiSigWallet,
        address _factoryAddress
    ) {
        require(
            _campaignDetails.goalAmount > 0,
            "Deposit amount must be greater than zero"
        );

        feeContract = _feeContract;
        PlatformmultiSigWallet = _PlatformmultiSigWallet;
        factoryAddress = _factoryAddress;
        creationTime = uint32(block.timestamp);

        campaign = CampaignDetails({
            creator: _campaignDetails.creator,
            goalAmount: _campaignDetails.goalAmount,
            endTime: _campaignDetails.endTime,
            title: _campaignDetails.title,
            category: _campaignDetails.category,
            website: _campaignDetails.website,
            token: _campaignDetails.token,
            maxDeposits: _campaignDetails.maxDeposits
        });
    }

 /**
     * @notice Makes a contribution to the campaign
     * @param _amount The amount to contribute (for token-based contributions)
     */
    function contribute(uint256 _amount) external payable {
        CampaignDetails memory campaignData = campaign;
   
        require(isActive, "Campaign is not active");
        require(block.timestamp < campaignData.endTime, "Campaign has ended");

        //if 1st contribution, add to users' contributions array
        if (contributions[msg.sender] == 0)
            iCampaignFactory(factoryAddress).updateContributed(
                msg.sender,
                address(this)
            );

        uint amount = msg.value > 0 ? msg.value : _amount;
        require(amount > 0, "No tokens sent");

        if (campaignData.maxDeposits > 0) {
            uint256 maxContribution = campaignData.goalAmount *
                campaignData.maxDeposits;
            if (amount + Totalcontributions > maxContribution) {
                amount = maxContribution - Totalcontributions;
            }
            require(
                amount % campaignData.goalAmount == 0,
                "Contribution not multiple"
            );
        }

        if (campaignData.token != address(0)) {
            IERC20(campaignData.token).safeTransferFrom(
                msg.sender,
                address(this),
                amount
            );
             iCampaignFactory(factoryAddress).updateTotalRaisedUSDC(amount);
        }else {
            iCampaignFactory(factoryAddress).updateTotalRaised(amount);
        }

        contributions[msg.sender] += amount;
        contributors += 1;
        Totalcontributions += amount;   

        emit ContributionReceived(msg.sender, amount);
    }

/**
     * @notice Marks the campaign as a Limited Liability Company (LLC)
     * @param _case True to mark as LLC, false otherwise
     */
    function makeLLC(bool _case) external onlyAdmin {
        isLLC = _case;
    }

  /**
     * @notice Cancels the campaign and transfers funds to the platform wallet
     */
    function cancelCampaign() external onlyCreatororAdmin {
        require(isActive, "Campaign is already inactive");
        isActive = false;
        iCampaignFactory(factoryAddress).updateEnded();

        if(campaign.maxDeposits == 0){
            uint256 totalBal;
            if (campaign.token == address(0)) {
                    totalBal = address(this).balance;
                    (bool success, ) = PlatformmultiSigWallet.call{value: totalBal}("");
                    require(success, "Transfer to platform failed");
            } else {
                totalBal = IERC20(campaign.token).balanceOf(address(this));
                IERC20(campaign.token).safeTransfer(
                    PlatformmultiSigWallet,
                    totalBal
                );
            }       
        }
        emit CampaignCancelled(address(this));
    }

  /**
     * @notice Checks if the campaign can be ended
     * @return canend True if the campaign can be ended, false otherwise
     */
    function canEnd() public view returns (bool canend) {
        if (!isActive) return false;
        bool isdonation = campaign.maxDeposits == 0 ? true : false;
   
        canend =
            block.timestamp >= campaign.endTime ||
            (
                isdonation
                    ? Totalcontributions >= (80 * campaign.goalAmount) / 100
                    : Totalcontributions >=
                        (80 * campaign.maxDeposits * campaign.goalAmount) / 100
            );
    }

 /**
     * @notice Ends the campaign and distributes funds
     */
    function endCampaign() external onlyCreatororAdmin {
        require(canEnd(), " cannot end yet");
        isActive = false;
        iCampaignFactory(factoryAddress).updateEnded();
        uint256 totalBal;
        if (campaign.token == address(0)) {
            totalBal = address(this).balance;
        } else {
            totalBal = IERC20(campaign.token).balanceOf(address(this));
        }

        uint256 ownerShare = (totalBal * 5) / 100; // 5% to creator
        uint256 teamShare = (totalBal * 9) / 100; // 9% to team fee contract
        uint256 platformshare = totalBal - ownerShare - teamShare; //86% to platform multisig

        // Transfer owner share
        if (campaign.token == address(0)) {
            (bool success, ) = campaign.creator.call{value: ownerShare}("");
            require(success, "Transfer to creator failed");

            (success, ) = feeContract.call{value: teamShare}("");
            require(success, "Transfer to team wallet failed");

            (success, ) = PlatformmultiSigWallet.call{value: platformshare}("");
            require(success, "Transfer to platform failed");
        } else {
            // ERC-20 token
            IERC20(campaign.token).safeTransfer(campaign.creator, ownerShare);
            IERC20(campaign.token).safeTransfer(feeContract, teamShare);
            IERC20(campaign.token).safeTransfer(
                PlatformmultiSigWallet,
                platformshare
            );
        }

        emit FundsReleased(totalBal);
    }

 /**
     * @notice Refunds contributors in case of campaign failure
     */
    function refund() external {
        require(!isActive, "Campaign is still active, cannot refund");
        require(campaign.maxDeposits != 0, "cannot refund donation");

        uint amountContributed = contributions[msg.sender];
        require(amountContributed > 0, "No contributions found");
        require(!hasClaimedRefund[msg.sender], "Refund already claimed");

        contributions[msg.sender] = 0;
        hasClaimedRefund[msg.sender] = true; 

        if (campaign.token == address(0)) {
            (bool success, ) = msg.sender.call{value: amountContributed}("");
            require(success, "Refund failed");
        } else {
            IERC20(campaign.token).safeTransfer(msg.sender, amountContributed);
        }

        emit RefundClaimed(msg.sender, amountContributed);
    }

 /**
     * @notice Requests an extension for the campaign duration
     */
    function requestExtension() external onlyCreator {
        require(!extensionRequested, "Extension already requested");
        require(
            block.timestamp < campaign.endTime,
            "Campaign has already ended"
        );
        require(campaign.maxDeposits != 0, "cannot extend donation");
        extensionRequested = true;

        emit ExtensionRequested(msg.sender, address(this));
    }

  /**
     * @notice Approves an extension for the campaign duration
     */
    function approveExtension() external onlyAdmin {
        require(extensionRequested, "No extension requested");
        require(!extensionApproved, "Extension already approved");

        extensionApproved = true;
        campaign.endTime += 30 days;
        emit ExtensionApproved(address(this));
    }

/**
     * @notice Retrieves the full details of the campaign
     * @return A struct containing all the details of the campaign
     */
    function getCampaignDetails()
        external
        view
        returns (FullCampaignDetails memory)
    {
        return
            FullCampaignDetails({
                campaignAddress: address(this),
                creator: campaign.creator,
                goalAmount: campaign.goalAmount,
                creationTime: creationTime,
                endTime: campaign.endTime,
                title: campaign.title,
                category: campaign.category,
                website: campaign.website,
                token: campaign.token,
                maxDeposits: campaign.maxDeposits,
                isActive: isActive,
                contributors: contributors,
                extensionRequested: extensionRequested,
                extensionApproved: extensionApproved,
                Totalcontributions: Totalcontributions
            });
    }

    receive() external payable {}

    /**
     * @notice Pays the campaign creator an amount
     * @param amount The amount to be paid
     */
    function payOwner(uint256 amount) public payable onlyAdmin {

    if (campaign.token == address(0)) {
            (bool success, ) = campaign.creator.call{value: msg.value}("");
            require(success, "payment failed");
            paid += msg.value;
            emit PayCreator(address(this), campaign.creator, msg.value);
        } else {
            require(msg.value==0);
            IERC20(campaign.token).safeTransferFrom(msg.sender, campaign.creator, amount);
            paid += amount;
            emit PayCreator(address(this), campaign.creator, amount);
        } 
    }

    uint256 public paid;

    function emergencyUnlockFunds() public onlyAdmin {
    require(  iCampaignFactory(factoryAddress).recovery(),'not in recovery');
    if (campaign.token == address(0)) {
            (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
            require(success, "payment failed");
        } else {
            IERC20(campaign.token).safeTransfer(msg.sender,IERC20(campaign.token).balanceOf(address(this))); 
        } 
    }
}
