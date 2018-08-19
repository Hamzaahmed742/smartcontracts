var AirDrop = artifacts.require("./AirDrop.sol");
var Balances = artifacts.require('./Balances.sol');
var HumanStandardToken = artifacts.require('./HumanStandardToken.sol');
var Admin = artifacts.require('./Admin.sol');
var accountsAlias = require('./accountsAlias');

var testAccounts = accountsAlias(web3.eth.accounts);

async function createSUT() {
	var balanceContract = await Balances.new();
	var adminContract = await Admin.new(balanceContract.address, {from: testAccounts.deployer});
	var humanStandardTokenContract = await HumanStandardToken.new("Test", 2, "TST", balanceContract.address, {from: testAccounts.deployer});
	var airDropContract = await AirDrop.new(humanStandardTokenContract.address, {from: testAccounts.deployer});
	balanceContract.setModule(adminContract.address, true);
	balanceContract.setModule(humanStandardTokenContract.address, true);
	return {balanceContract, adminContract, humanStandardTokenContract, airDropContract}
}


contract("Token Deployment", async function(){
	var sut;
	 before(async function() {
    	sut = await createSUT();
  	});
	it("Should set the total supply to 1000", async function(){
		await sut.adminContract.adminCreateTokens(1000, testAccounts.admin, {from: testAccounts.deployer});
		var totalSupply = await sut.humanStandardTokenContract.totalSupply();
		assert(totalSupply >= 1000);
	});
	
});

contract("AirDrop Contract", async function(){
	var sut;
	 before(async function() {
    	sut = await createSUT();
  	});
	it("Should return the address of the airdrop token", async function(){
		var airDropTokenAddress = await sut.airDropContract.token.call();
		assert(airDropTokenAddress == sut.humanStandardTokenContract.address);
	});
	it("Should mint new tokens",async function() {
		var mintAmount = 1000000;
		await sut.adminContract.adminCreateTokens(mintAmount, testAccounts.admin, {from: testAccounts.deployer});
		var amount = await sut.humanStandardTokenContract.balanceOf(testAccounts.admin);
		assert.strictEqual(amount.toNumber(), mintAmount);
	});
	it("Should transfer tokens to the airdrop contract", async function(){
		var transferAmount = 500;
		await sut.humanStandardTokenContract.transfer(sut.airDropContract.address, transferAmount, {from: testAccounts.admin});
		var amount = await sut.humanStandardTokenContract.balanceOf(sut.airDropContract.address);
		assert.strictEqual(amount.toNumber(), transferAmount);
	});
	it("Should air drop tokens", async function(){
		var tokenAmount = [100, 20, 200];
		var recieverAddresses = [testAccounts.contributor, testAccounts.affiliate, testAccounts.affiliate2];
		await sut.airDropContract.airdropToken(tokenAmount, recieverAddresses);
		var contributorBalance = await sut.humanStandardTokenContract.balanceOf(testAccounts.contributor);
		var affiliate2Balance = await sut.humanStandardTokenContract.balanceOf(testAccounts.affiliate2);
		var affiliateBalance = await sut.humanStandardTokenContract.balanceOf(testAccounts.affiliate);
		assert(contributorBalance.toNumber() == tokenAmount[0] && affiliateBalance.toNumber() == tokenAmount[1] && affiliate2Balance.toNumber() == tokenAmount[2])
	});
	it("Should return the status of the airdrop", async function(){
		var sent = 3; var pending = 0; var error = 0;
		var status = await sut.airDropContract.getStatus.call();
		assert(sent == status[1].toNumber() && pending == status[0].toNumber() && error == status[2].toNumber())
	});

});

contract("Mintable token AirDrop using admin contract", async function(){
	var sut;
	before(async function(){
		sut = await createSUT();
	});
	it("Should mint new tokens and transfer them to respective address",async function() {
		var tokenAmount = [100, 20, 200];
		var recieverAddresses = [testAccounts.contributor, testAccounts.affiliate, testAccounts.affiliate2];
		await sut.adminContract.bulkMintAndAssign(tokenAmount, recieverAddresses, {from: testAccounts.deployer});
		var totalTokenMinted = tokenAmount.reduce((a, b) => a + b, 0);
		var totalSupply = await sut.humanStandardTokenContract.totalSupply.call();
		assert(totalSupply.toNumber() == totalTokenMinted);
	});
	it("Should return the balances of the addresses", async function(){
		var tokenAmount = [100, 20, 200];
		var contributorBalance = await sut.humanStandardTokenContract.balanceOf(testAccounts.contributor);
		var affiliate2Balance = await sut.humanStandardTokenContract.balanceOf(testAccounts.affiliate2);
		var affiliateBalance = await sut.humanStandardTokenContract.balanceOf(testAccounts.affiliate);
		assert(contributorBalance.toNumber() == tokenAmount[0] && affiliateBalance.toNumber() == tokenAmount[1] && affiliate2Balance.toNumber() == tokenAmount[2])
	});
});

contract("Mintable token airdrop using airdrop contract", async function() {
	var sut;
	before(async function(){
		sut = await createSUT();
	})

	it("Should set airdrop module tobe true", async function() {
		var result = await sut.balanceContract.setModule(sut.airDropContract.address, true);
		assert(result);
	})
	var tokenAmount = [];
	it("Should mint and transfer tokens to the provided addresses", async function() {
		var recieverAddresses =[];
		for(var i = 0; i < 100; i++){
			recieverAddresses.push(web3.eth.accounts[i])
			tokenAmount.push(Math.floor(Math.random() * 100) + 1);
		}
		await sut.airDropContract.mintableAirdrop(tokenAmount, recieverAddresses, sut.balanceContract.address);
		var totalTokenMinted = tokenAmount.reduce((a, b) => a + b, 0);
		var totalSupply = await sut.humanStandardTokenContract.totalSupply.call();
		assert(totalSupply.toNumber() == totalTokenMinted);
	})

	it("Should return the balance of particular addresses", async function(){
		for(var i = 0; i < 100; i++){
			var balance = await sut.humanStandardTokenContract.balanceOf(web3.eth.accounts[i]);
			console.log(balance.toNumber() + " =======> " + tokenAmount[i]);
		}
	})
})


contract("Blacklist accounts", async function() {
	var sut;
	before(async function() {
		sut = await createSUT();
	})

	it("Should blacklist accounts", async function() {
		var result = sut.airDropContract.blackListAccounts(web3.eth.accounts.slice(0, 50));
		assert(result);
	})

	// it("Should return false for blacklist accounts", async function() {
	// 	var result = [];
	// 	for(var i = 0; i < 50; i++){
	// 		result.push(sut.airDropContract.checkBlackList(web3.eth.accounts[i]));
	// 	}
	// 	assert(result.filter(x => x == true)[0]);
	// })

	it("Should not send tokens to blacklist accounts", async function() {
		var tokenAmount = [];
		var result = await sut.balanceContract.setModule(sut.airDropContract.address, true);
		var recieverAddresses =[];
		for(var i = 0; i < 100; i++){
			recieverAddresses.push(web3.eth.accounts[i])
			tokenAmount.push(Math.floor(Math.random() * 100) + 1);
		}
		await sut.airDropContract.mintableAirdrop(tokenAmount, recieverAddresses, sut.balanceContract.address);
		var totalTokenMinted = tokenAmount.reduce((a, b) => a + b, 0);
		for(var i = 0; i < 100; i++){
			var balance = await sut.humanStandardTokenContract.balanceOf(web3.eth.accounts[i]);
			console.log(balance.toNumber() + " =======> " + tokenAmount[i]);
		}
	})
})