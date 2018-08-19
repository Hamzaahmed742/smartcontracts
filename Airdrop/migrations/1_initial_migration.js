var Migrations = artifacts.require("./Migrations.sol");
var AirDrop = artifacts.require("./AirDrop.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(AirDrop);
};
