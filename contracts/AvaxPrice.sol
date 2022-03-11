// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./SafeMath.sol";

contract AvaxPrice {

    using SafeMath for int256;

    AggregatorV3Interface internal priceFeed;

    constructor(address _feedAddress) {
        priceFeed = AggregatorV3Interface(_feedAddress);
    }

    function getCurrentPrice() public view returns (int256) {
        (
            /*uint80 roundID*/,
            int256 _price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return _price;
    }

    function convertCurrency(int256 _usdAmount) public view returns (string memory) {
        (
            /*uint80 roundID*/,
            int256 _price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        int256 avaxAmount = _usdAmount.mul(10 ** 8).div(_price);
        int256 modAmount = _usdAmount.mul(10 ** 8).mod(_price);
        string memory avaxAmountStr = Strings.toString(uint256(avaxAmount));
        avaxAmountStr = string(abi.encodePacked(avaxAmountStr, '.'));
        for(int256 i = 0; i < 8; i ++) {
            avaxAmountStr = string(abi.encodePacked(avaxAmountStr, Strings.toString(uint256(modAmount.mul(10).div(_price)))));
            modAmount = modAmount.mul(10).mod(_price);
        }
        return (avaxAmountStr);
    }

}