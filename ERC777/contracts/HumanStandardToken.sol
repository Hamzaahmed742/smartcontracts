pragma solidity ^0.4.19;


import "./StandardToken.sol";
import "./Balances.sol";

contract HumanStandardToken is StandardToken {
	
	 /* -- Constructor -- */
    //
    /// @notice Constructor to create a ReferenceToken
    /// @param _name Name of the new token
    /// @param _symbol Symbol of the new token.
    /// @param _granularity Minimum transferable chunk.
    /// @param _balances address of the Balances contract
    constructor(
        string _name,
        uint256 _granularity,
        string _symbol,
        address _balances
    )
        public
    {
        mName = _name;
        mSymbol = _symbol;
        owner = msg.sender;
        balances = Balances(_balances);
        mErc20compatible = true;
        require(_granularity >= 1);
        mGranularity = _granularity;

        setInterfaceImplementation("ERC20Token", this);
        setInterfaceImplementation("ERC777Token", this);
    }
}

