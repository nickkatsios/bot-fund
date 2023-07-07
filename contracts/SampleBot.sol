// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SampleBot {

    address[] public acceptedTokens;

    constructor(address[] memory _acceptedTokens) {
        acceptedTokens = _acceptedTokens;
    }

    function doStuff() external view {}

    function transferToken(address token , address recipient, uint256 amount) external {
        require(IERC20(token).transfer(recipient, amount), "Token transfer failed");
    }
}