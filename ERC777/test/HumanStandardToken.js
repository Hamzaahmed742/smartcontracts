var Balances = artifacts.require('./Balances.sol');
var HumanStandardToken = artifacts.require('./HumanStandardToken.sol');
var Admin = artifacts.require('./Admin.sol');
var accountsAlias = require('./accountsAlias');

var testAccounts = accountsAlias(web3.eth.accounts);

async function createSUT() {
	const balanceContract = await Balances.new();
	balanceContract.setModule(testAccounts.module, true);
	return balanceContract;
}

contract("HumanStandardToken Contract", function(){
	it("Should deploy the HumanStandardToken Contract", async function(){
		var balances = await createSUT();
		var humanStandardToken = await HumanStandardToken.new("Test", "TST", 18, balances.address);
	});

	it("Should return the name of the token",async function(){
		var balances = await createSUT();
		var name = await.HumanStandardToken.name();
		assert(name == "Test");
	})

	it("Should return the decimals of the token",async function(){
		var balances = await createSUT();
		var decimals = await.HumanStandardToken.granularity();
		assert(decimals == 18);
	})

	it("Should return address of the Balances Contract",async function(){
		var balances = await createSUT();
		var address = await.HumanStandardToken.balances.call();
		assert(address == balances.address);
	})
});