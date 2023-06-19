//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "./BotToken.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract Fundraiser {

    // the address of the bot owner
    address public owner;

    // the address of the bot deployed
    // source code is verifiable so users can check if it would be effective
    address public bot;

    // the amount contributed to the fund for each token by each participant 
    mapping(address => mapping(address => uint)) public participantBalance;

    // the token addresses accepted by the fund ex. DAI , USDT ...
    address[] public acceptedTokens;

    // the target amount to be raised for each accepted token
    mapping(address => uint) public targets;

    // the corresponding amount of bot tokens to receive for every whitelisted token sent
    mapping(address => uint) public tokenRewardRate;

    BotToken public botToken; 

    event FundsReceived(address indexed participant , address indexed token , uint indexed amount);
    event Withdraw(address bot);
    event TargetHit(address indexed token);

    constructor(address[] memory _acceptedTokens , uint[] memory _targetAmounts , address _bot , address _botToken) {
        require(_acceptedTokens.length == _targetAmounts.length , "Invalid input");
        owner = msg.sender;
        bot = _bot;
        acceptedTokens = _acceptedTokens;
        botToken = BotToken(_botToken);
        for(uint i = 0 ; i < _acceptedTokens.length ; i++ ) {
           targets[_acceptedTokens[i]] = _targetAmounts[i];
        }
    }

    function receiveFunds(address token , uint amount) public {
        // check to see if token is in allowlist
        require(isTokenAccepted(token) , "Token not accepted by fundraiser ");
        // check to see the amount sent for the token is > 0 
        require(amount > 0 , "amount needs to be greater than 0");
        // check to see if the target has been reached
        require(!hasTokenHitTarget(token) , "Target for token already hit");
        // update targets and balances
        updateTargetsAndBalances(token , amount);
        // mint the bot tokens to the user
        distributeBotTokens(msg.sender , token);
        emit FundsReceived(msg.sender , token , amount);
    }

    // after the fundraiser is over the owner withdraws the funds to the bot
    function withdrawFundsToBot() onlyOwner public {
        for (uint256 i = 0; i < acceptedTokens.length; i++) {
            address token = acceptedTokens[i];
            uint256 balance = IERC20(token).balanceOf(address(this));
            if (balance > 0) {
                IERC20(token).transfer(bot, balance);
            }
        }
        emit Withdraw(bot);
    }

    function distributeBotTokens(address participant , address token) internal {
        // get reward rate for the token
        uint amountToMint = tokenRewardRate[token]; 
        // mint bot tokens and tranfer them to participant address
        botToken.mint(participant , amountToMint);
    }

    // updates the state of the contract after receiveing funds
    function updateTargetsAndBalances(address token , uint amount) internal {
        uint change;
        if (targets[token] < amount) {
            change = targets[token];
            targets[token] = 0;
            emit TargetHit(token);
        } else {
            change = amount;
            targets[token] -= amount;
        }
        participantBalance[msg.sender][token] += change;
    }

    function getParticipantTokenBalance(address participant , address token) public view returns(uint) {
        // look up the amount raised by the participant address for the specific token
        return participantBalance[participant][token];
    }

    // check if remaining target is > 0
    function hasTokenHitTarget(address token) public view returns(bool) {
        return targets[token] > 0;
    }

    // checks to see if the token is in the whitelist
    function isTokenAccepted(address token) public view returns(bool) {
        for(uint i = 0 ; i < acceptedTokens.length ; i++ ) {
            if(token == acceptedTokens[i]) {
                return true;
            }
        }
        return false;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

}