pragma solidity ^0.4.19;

contract Token {
    function totalSupply() constant public returns(uint256 supply);
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function approve(address _spender, uint256 _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);
}


contract Balances {
    
    event BalanceAdj(address indexed sender, address indexed account, uint256 amount, string polarity);
    event ModuleSet(address indexed Module, bool indexed Set);
    function incBalance (address _acct, uint256 _amount)   public returns(bool res);
    
    function decBalance (address _acct, uint256 _amount)  public returns(bool res);

    function getBalance (address _acct) public view returns(uint256 amount);

    function getTotalSupply () public view returns (uint256 amount);

    function incTotalSupply (uint256 _amount)  public returns(bool success);

    function decTotalSupply (uint256 _amount)   public returns(bool success);

     function getAllowance(address _owner, address _spender) public view returns(uint remaining);
    
    function setApprove(address _sender, address _spender, uint256 _value)  public returns (bool success);

    function decApprove(address _from, address _spender, uint _value)  public returns (bool success);

    function getModule(address _acct) public view returns (bool success);

    function setModule(address _acct, bool _set)  public  returns(bool success);
}


contract AirDrop {
	Token public token;
	uint256 public totalPending;
	uint256 public totalSent;
	uint256 public transferError;
	address public root;
	mapping (address => bool) blackList;

	event Airdropped(address indexed User, uint Amount);

	constructor(address _tkn) public{
		token = Token(_tkn);
		root = msg.sender;
	}

	modifier onlyRoot(){
        require(msg.sender == root);
        _;
    }
    
    function blackListAccounts(address[] _acct) onlyRoot public returns(bool res) {
    	for (uint i = 0; i < _acct.length; i++){
    		blackList[_acct[i]] = true;
    	}
    	return true;
    }    

    function setBlackList (address _acct, bool _set) onlyRoot public returns(bool res)   {
    	blackList[_acct] = _set;
    	return true;
    }
    
    function checkBlackList(address _acct) public view returns (bool res)  {
    	return blackList[_acct];
    }

	function airdropToken(uint256[] _amount, address[] _acct) onlyRoot public {
		totalPending = _acct.length;
		totalSent = 0;
		transferError = 0;
		for(uint i = 0; i< _acct.length; i++){
			if(checkBlackList(_acct[i]) == false) {
				if(token.transfer(_acct[i], _amount[i])){
					totalSent += 1;
					totalPending -= 1;
				}else{
					transferError += 1;
				}
			}
		}
	}

	function mintableAirdrop(uint256[] _amount, address[] _acct, address _balances) onlyRoot public {
		Balances balances = Balances(_balances);
		totalPending = _acct.length;
		totalSent = 0;
		transferError = 0;
		for(uint i = 0; i< _acct.length; i++){
			if(checkBlackList(_acct[i]) == false) {
				if(balances.incTotalSupply(_amount[i]) && balances.incBalance(_acct[i], _amount[i])){
					totalSent += 1;
					totalPending -= 1;
				}else{
					transferError += 1;
				}
			}
		}
	}

	function airdropTokenUsingBalances(uint256[] _amount, address[] _acct, address _balances, address _reserve) onlyRoot public {
		Balances balances = Balances(_balances);
		for(uint i = 0; i< _acct.length; i++){
			if(checkBlackList(_acct[i]) == false) {
				balances.incBalance(_acct[i], _amount[i]);
				balances.decBalance(_reserve, _amount[i]);
			}
		}
	}

	function getStatus() public returns(uint256 pending, uint256 sent, uint256 transferError){
		return (totalPending, totalSent, transferError);
	}

	function empty(address _sendTo) public onlyRoot { _sendTo.transfer(address(this).balance); }
    function kill() public onlyRoot { selfdestruct(root); }
    function transferRoot(address _newOwner) public onlyRoot { root = _newOwner; }
}

