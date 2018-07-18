var Balances = artifacts.require('./Balances.sol');
var HumanStandardToken = artifacts.require('./HumanStandardToken.sol');
var Admin = artifacts.require('./Admin.sol');
var accountsAlias = require('./accountsAlias');

var testAccounts = accountsAlias(web3.eth.accounts);

async function createSUT(){
	var balanceContract = await Balances.new();
	var adminContract = await Admin.new(balanceContract.address);
	var humanStandardTokenContract = await HumanStandardToken.new("Test", 2, "TST", balanceContract.address);
	balanceContract.setModule(adminContract.address, true);
	balanceContract.setModule(humanStandardTokenContract.address, true);
	return {balanceContract, adminContract, humanStandardTokenContract}
}

contract("HumanStandardToken Contract", async function(){
	


	it("Should return true for admin contract (get module)", async function(){
		var sut = await createSUT();
		var result = await sut.balanceContract.getModule(sut.adminContract.address);
		assert(result);
	});

	it("Should return true for HumanStandardToken contract (get module)", async function(){
		var sut = await createSUT();
		var result = await sut.balanceContract.getModule(sut.humanStandardTokenContract.address);
		assert(result);
	});

	it("Should return the name of the token",async function(){
		var sut = await createSUT();
		var name = await sut.humanStandardTokenContract.name.call();
		assert(name == "Test");
	});

	it("Should return the total supply(should be 0)", async function(){
		var sut = await createSUT();
		var totalSupply = await sut.humanStandardTokenContract.totalSupply.call();
		assert(totalSupply == 0);		
	});

	it("Should return the address of the balance contract", async function(){
		var sut = await createSUT();
		var balanceContractAddress = await sut.balanceContract.address;
		var address = await sut.humanStandardTokenContract.balances.call();
		assert(address == balanceContractAddress);
	});

	it("Should set the total supply to 1000", async function(){
		var sut = await createSUT();
		await sut.adminContract.adminCreateTokens(1000, testAccounts.admin, {from: testAccounts.deployer});
		var totalSupply = await sut.humanStandardTokenContract.totalSupply();
		assert(totalSupply >= 1000);
	});

});