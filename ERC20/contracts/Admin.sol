pragma solidity ^0.4.19;

import './Balances.sol';
import './SafeMath.sol';

contract Admin{
    using SafeMath for uint;
    
    event AdminMint(address indexed User, string Action, uint Tokens);
    event AdminMoveTokens(address indexed FromUser, address indexed ToUser, uint Amount);

    address public root;
    Balances public balances;
    mapping(address => bool) admins;

    
    modifier onlyRoot(){
        require(msg.sender == root);
        _;
    }
    
    modifier onlyRootOrAdmin(){
        require(msg.sender == root || admins[msg.sender] == true);
        _;
    }
    
    constructor(address _balances) public {
        root = msg.sender;
        balances = Balances(_balances);
    }
    
    function() public {
        revert();
    }
    
    function adminCreateTokens(uint256 _amount, address _receiver) onlyRootOrAdmin public returns(bool){
        balances.incBalance(_receiver, _amount);
        balances.incTotalSupply(_amount);
        emit AdminMint(_receiver, "Token Minted", _amount);
        return true;
    }
    
    function bulkMintAndAssign(uint256[] _amount, address[] _receiver)  onlyRootOrAdmin public returns(bool) {
        for(uint i = 0; i < _receiver.length; i++){
            balances.incBalance(_receiver[i], _amount[i]);
            balances.incTotalSupply(_amount[i]);
            emit AdminMint(_receiver[i], "Token Minted", _amount[i]); 
        }
        return true;
    }

    function moveBalance(address _from, address _to) onlyRootOrAdmin public returns(bool){
        uint256 bal = balances.getBalance(_from);
        balances.decBalance(_from, bal);
        balances.incBalance(_to, bal);
        emit AdminMoveTokens(_from, _to, bal);
        return true;
    }
    
    function empty(address _sendTo) public onlyRoot { _sendTo.transfer(address(this).balance); }
    function kill() public onlyRoot { selfdestruct(root); }
    function transferRoot(address _newOwner) public onlyRoot { root = _newOwner; }
    function setAdmin(address admin, bool isAdmin) public onlyRoot { admins[admin] = isAdmin; }
}