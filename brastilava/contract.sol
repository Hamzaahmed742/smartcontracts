pragma solidity ^0.4.19;

import './SafeMath.sol';

contract contract {
    using SafeMath for uint256;
    
    uint256 public fee = 1000;
    address public beneficiary;
    address public root;
    bool public res;
    event fundsTransfer(address beneficiary,address token, uint256 amount, uint256 fee );
    
    
    modifier onlyRoot(){
        require(msg.sender == root);
        _;
    }
    
    function() payable public  {
        uint feeAmount = msg.value.div(fee);
        uint remainigAmount = msg.value.sub(feeAmount);
        beneficiary.transfer(feeAmount);
        require(_token.call.value(remainigAmount)(""));
        emit fundsTransfer(beneficiary, _token, remainigAmount, feeAmount);
    }
    
    constructor() public {
        root = msg.sender;
        beneficiary = msg.sender;
    }
    
    function deposit(address _token) public payable returns(uint256 _remainigAmount, uint256 _feeAmount) {
        uint feeAmount = msg.value.div(fee);
        uint remainigAmount = msg.value.sub(feeAmount);
        beneficiary.transfer(feeAmount);
        require(_token.call.value(remainigAmount)(""));
        emit fundsTransfer(beneficiary, _token, remainigAmount, feeAmount);
        return(remainigAmount, feeAmount);
    }
    
    function changeBeneficiary(address _acct) public onlyRoot returns(bool) {
        beneficiary = _acct;
        return true;
    }
    
    function changeFee(uint256 _fee) public onlyRoot returns(bool) {
        fee = _fee;
        return true;
    } 
    
    function empty(address _sendTo) public onlyRoot { _sendTo.transfer(address(this).balance); }
    function kill() public onlyRoot { selfdestruct(root); }
    function transferRoot(address _newOwner) public onlyRoot { root = _newOwner; }
}