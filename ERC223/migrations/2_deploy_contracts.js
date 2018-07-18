var Admin = artifacts.require("./Admin.sol");
var Balances = artifacts.require("./Balances.sol");
var HumanStandardToken = artifacts.require("./HumanStandardToken.sol");


module.exports = function(deployer){
	deployer.deploy(Balances).then(function(){
		return deployer.deploy(Admin, Balances.address).then(function(){
			return deployer.deploy(HumanStandardToken, "Test", 2, "TST", Balances.address)
		})
	})
}