var Balances = artifacts.require('Balances');
var accountsAlias = require('./accountsAlias');
var testAccounts = accountsAlias(web3.eth.accounts);

async function createSUT() {
	const balanceContract = await Balances.new();
	balanceContract.setModule(testAccounts.module, true);
	return balanceContract;
}

contract("Balances Contract", function(){
	it("Should return the root of the balance contract", async function(){
		var balances = await createSUT();
		var root = await balances.root.call();
		assert(root == testAccounts.deployer);
	});

	it("Should return the result of the given module address", async function(){
		var balances = await createSUT();
		var result = await balances.getModule.call(testAccounts.module);
		assert(result == true);
	});

	it("Should increase the total supply", async function(){
		var balances = await createSUT();
		await balances.incTotalSupply(1000, {from: testAccounts.module});
		var result = await balances.totalSupply.call();
		assert(result >= 1000);
	})
})