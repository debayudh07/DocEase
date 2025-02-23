// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin's ERC20 implementation
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Docease is ERC20 {
    // Constructor: Initialize the token with a name, symbol, and initial supply
    constructor() ERC20("DOCEASE", "DOC") {
        // Mint 1,000,000 tokens to the deployer's address
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    // Override the `transfer` function (optional, for additional functionality)
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // Call the parent ERC20 `transfer` function
        super.transfer(recipient, amount);
        return true;
    }

    // Override the `approve` function (optional, for additional functionality)
    function approve(address spender, uint256 amount) public override returns (bool) {
        // Call the parent ERC20 `approve` function
        super.approve(spender, amount);
        return true;
    }

    // Override the `transferFrom` function (optional, for additional functionality)
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        // Call the parent ERC20 `transferFrom` function
        super.transferFrom(sender, recipient, amount);
        return true;
    }

    // Additional utility function to check the balance of an address
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    // Additional utility function to check the allowance granted to a spender
    function getAllowance(address owner, address spender) public view returns (uint256) {
        return allowance(owner, spender);
    }
}