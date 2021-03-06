// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

/** 
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Discounts = await hre.ethers.getContractFactory("StaterDiscounts");
  console.log('Discounts: Got Contract Factory');
  const sender = await hre.ethers.getSigner();
  //const initialNonce = await sender.getTransactionCount();
  const discounts = await Discounts.deploy();
  console.log('Discounts: Deployed Contract ' + JSON.stringify(discounts));

  await discounts.deployed();
  console.log('Discounts: Got deployed contract >> ' + JSON.stringify(discounts));

  await discounts.addDiscount(2,"0x1a08a4be4c59d808ee730d57a369b1c09ed62352",20,[]);
  console.log('Discounts: Add Geyser Discount >> ' + JSON.stringify(discounts));
  await discounts.addDiscount(1,"0x4100670ee2f8aef6c47a4ed13c7f246e621228ec",2,[1,4,5,2]);
  console.log('Discounts: Add Stater Rarible tokens Discount >> ' + JSON.stringify(discounts));

  const PromissoryNote = await hre.ethers.getContractFactory("StaterPromissoryNote");
  console.log('PromissoryNote: Got Contract Factory >> ' + JSON.stringify(PromissoryNote));
  const promissoryNote = await PromissoryNote.deploy("Test Promissory Note","TPN");
  console.log('PromissoryNote: Deployed Contract >> ' + JSON.stringify(promissoryNote));

  const LendingMethods = await hre.ethers.getContractFactory("LendingMethods");
  console.log('LendingMethods: Got Contract Factory >> ' + JSON.stringify(LendingMethods));
  const lendingMethods = await LendingMethods.deploy();
  console.log('LendingMethods: Deployed Contract >> ' + JSON.stringify(lendingMethods));

  const LendingTemplate = await hre.ethers.getContractFactory("LendingTemplate");
  console.log('LendingTemplate: Got Contract Factory >> ' + JSON.stringify(LendingTemplate));
  const lendingTemplate = await LendingTemplate.deploy(promissoryNote.address,lendingMethods.address,discounts.address);
  console.log('LendingTemplate: Deployed Contract >> ' + JSON.stringify(lendingTemplate));
  await lendingTemplate.deployed();
  console.log('LendingTemplate: Got Deployed Contract >> ' + JSON.stringify(lendingTemplate));

  const deployedPromissoryNote = await promissoryNote.deployed();
  console.log('PromissoryNote: Got Deployed Contract >> ' + JSON.stringify(promissoryNote));
  await lendingMethods.deployed();
  console.log('LendingMethods: Got Deployed Contract >> ' + JSON.stringify(lendingMethods));
  await deployedPromissoryNote.setLendingDataAddress(lendingTemplate.address);
  console.log('PromissoryNote: Set Lending Data Address >> ' + JSON.stringify(deployedPromissoryNote));

  console.log('\n=========================================================================\n')

  console.log("Discounts deployed to:", discounts.address);
  console.log("Promissory Note deployed to:" + promissoryNote.address);
  console.log("Lending methods deployed to:" + lendingMethods.address);
  console.log("Lending template deployed to:" + lendingTemplate.address);


  console.log('\n=========================================================================\n')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
