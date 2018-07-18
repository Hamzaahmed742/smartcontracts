pragma solidity ^0.4.19;

contract Balances {
	address public root;
	uint256 public totalSupply;

	mapping (address => uint) balances;
	mapping (address => bool) modules;
	mapping (address => mapping (address => uint)) allowed;
	
	event BalanceAdj(address indexed sender, address indexed account, uint256 amount, string polarity);
	event ModuleSet(address indexed Module, bool indexed Set);

	modifier onlyRoot() { 
		require (msg.sender == root); 
		_; 
	}
	
	modifier onlyModule() { 
		require (modules[msg.sender] == true); 
		_; 
	}
	
	function() payable public {
		revert();
	}

	constructor() public {
		root = msg.sender;
	}

	function incBalance (address _acct, uint256 _amount)  onlyModule public returns(bool res) {
		balances[_acct] += _amount;
		emit BalanceAdj(msg.sender, _acct, _amount, "+");
		return true;
	}
	
	function decBalance (address _acct, uint256 _amount) onlyModule public returns(bool res) {
		balances[_acct] -= _amount;
		emit BalanceAdj(msg.sender, _acct, _amount, "-");
		return true;
	}

	function getBalance (address _acct) public view returns(uint256 amount)  {
		return balances[_acct];
	}

	function getTotalSupply () public view returns (uint256 amount) {
		return totalSupply;
	}	

	function incTotalSupply (uint256 _amount) onlyModule public returns(bool success) {
		totalSupply += _amount;
		return true;
	}

	function decTotalSupply (uint256 _amount)  onlyModule public returns(bool success) {
		totalSupply -= _amount;
		return true;
	}

	 function getAllowance(address _owner, address _spender) public view returns(uint remaining){
	    return allowed[_owner][_spender];
	 }
	
	function setApprove(address _sender, address _spender, uint256 _value) onlyModule public returns (bool success) {
		allowed[_sender][_spender] = _value;
		return true;
	}

  	function decApprove(address _from, address _spender, uint _value) onlyModule public returns (bool success){
	    allowed[_from][_spender] -= _value;
	    return true;
	 }

	function getModule(address _acct) public view returns (bool success){
	    return modules[_acct];
	}

  	function setModule(address _acct, bool _set) onlyRoot public  returns(bool success){
	    modules[_acct] = _set;
	    emit ModuleSet(_acct, _set);
	    return true;
	}
	
	
}

