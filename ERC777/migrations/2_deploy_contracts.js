var StandardToken = artifacts.require('./StandardToken.sol');
var Balances = artifacts.require('./Balances.sol');
var Admin = artifacts.require('./Admin.sol');

module.exports = function(deployer){
	deployer.deploy(Balances).then(function(){
		return deployer.deploy(Admin, Balances.address).then(function(){
			return deployer.deploy(StandardToken, "Test", "TST", 18, Balances.address);
		})
	})
}