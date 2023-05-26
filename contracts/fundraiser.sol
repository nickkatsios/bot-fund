//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.6;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Fundraiser {

    // the address of the bot owner
    address owner;

    // the address of the bot deployed
    // source code is verifiable so users can check if it would be effective
    address bot;

    // the amount contributed to the fund for each token by each participant 
    mapping(address => mapping(address => uint)) participantBalance;

    // the token addresses accepted by the fund ex. DAI , USDT ...
    address[] acceptedTokens;

    // the target amount to be raised for each accepted token
    mapping(address => uint) targets;

    // the corresponding amount of bot tokens to receive for every whitelisted token sent
    mapping(address => uint) tokenRewardRate;

    constructor(address[] _acceptedTokens) {
        owner = msg.sender;
        acceptedTokens = _acceptedTokens;
    }

    function receiveFunds(address token , uint amount) public returns(uint) {
        // see if token is accepted , if not revert
        require(token != address(0) , "token not accepted , see whitelist" );
        // check to see the amount sent for the token is > 0 
        require(amount > 0 , "amount needs to be greater than 0");
        // mint the bot tokens to the user
        distributeBotTokens(msg.sender);
        // IERC20
    }

    function withdrawToBot() public onlyOwner {
        // for every token address send all the contract balance to bot address
    }

    function distributeBotTokens(address participant) internal view {
        // mint bot tokens and tranfer them to participant address
    }

    function getBalanceRaised(address _token) public view returns(uint) {
        // look up and sum the amounts raised for each token
    }

    function getParticipantTokenBalance(address participant , address token) public view returns(uint) {
        // look up the amount raised by the participant address for the specific token
        return participantBalance[participant][token];
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier tokenAccepted {
        require(token != address(0) , "token not accepted , see whitelist" );
        _;
    }

}