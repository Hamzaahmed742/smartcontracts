var Balances = artifacts.require('./Balances.sol');
var Admin = artifacts.require('./Admin.sol');
var HumanStandardToken = artifacts.require('./HumanStandardToken.sol');
var AirDrop = artifacts.require('./AirDrop.sol');

module.exports = function(deployer){
	deployer.deploy(Balances).then(function(){
		return deployer.deploy(Admin, Balances.address).then(function(){
			return deployer.deploy(HumanStandardToken, "Test", 2, "TST", Balances.address).then(function(){
				return deployer.deploy(AirDrop, HumanStandardToken.address);
			})
		})
	})
	
}