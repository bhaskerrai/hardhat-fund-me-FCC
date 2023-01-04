// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


//Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";


//Error codes
error FundMe__NotOwner();

//1.Interfaces, 2.Libraries, 3.Contracts (this should be the sequence in the code)

/** @title A contract for crowd funding.
 * @author Bhasker Rai
 * @dev This implements price feeds as our library
 */

contract FundMe {
    //sequence to be followed inside a contract:
    //1.Type declarations
    //2.State variables
    //3.Events
    //4.Erorr
    //5.Modifiers
    //6.Functions


    //Type declarations
    using PriceConverter for uint256;

    //State variables
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    AggregatorV3Interface private s_priceFeed;

    // Events (we have none!)

    //Modifier
    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions Order:
    //1. constructor
    //2. receive
    //3. fallback
    //4. external
    //5. public
    //6. internal
    //7. private
    //8. view / pure

    
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    
    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }
    
    
    function withdraw() public onlyOwner {
        for (uint256 funderIndex=0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
      
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        // call vs delegatecall
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner{
        address[] memory funders = s_funders;
        //mappings can't be in memory

        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool success, ) = i_owner.call{ value: address(this).balance }("");
        require(success);
    }

    function getOwner() public view returns(address){
        return i_owner;
    }

    function getFunders(uint256 index) public view returns(address){
        return s_funders[index];

    }

    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns(AggregatorV3Interface){
        return s_priceFeed;
    }
}