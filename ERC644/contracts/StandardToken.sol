pragma solidity ^0.4.19;

import "./Token.sol";
import "./Balances.sol";

contract StandardToken is Token{
	Balances public balances;

	function transfer (address _to, uint256 _value) public returns(bool) {
		if(balances.getBalance(msg.sender) > _value && _value > 0){
			balances.decBalance(msg.sender, _value);
			balances.incBalance(_to, _value);
			emit Transfer(msg.sender, _to, _value);
			return true;
		}else{
			return false;
		}
	}

	function transferFrom (address _from, address _to, uint256 _value)public returns(bool) {
		if (balances.getBalance(msg.sender) >= _value && balances.getAllowance(msg.sender, _to) >= _value && _value > 0) {
            balances.incBalance(_to, _value);
            balances.decBalance(msg.sender, _value);
            balances.decApprove(_from, msg.sender, _value);
            emit Transfer(_from, _to, _value);
            return true;
		}else{
			return false;
		}
	}
	
	function balanceOf (address _acct) public view returns(uint) {
		return balances.getBalance(_acct);
	}

	function allowance (address _owner, address _spender) public view returns(uint) {
		return balances.getAllowance(_owner, _spender);
	}
	
	function totalSupply () public view returns(uint) {
		return balances.getTotalSupply();
	}
	
	function approve (address _spender, uint _value) public returns(bool) {
		balances.setApprove(msg.sender, _spender, _value);
		emit Approval(msg.sender, _spender,_value);
		return true;
	}
	
	
}

