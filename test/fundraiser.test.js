const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  
  describe("Fundraiser", function () {

    async function deployFundraiser() {
      const [owner, otherAccount] = await ethers.getSigners();
      const Fundraiser = await ethers.getContractFactory("Fundraiser");
      const accepted = ["0xdD2FD4581271e230360230F9337D5c0430Bf44C0"]
      const targets = [1000000000] 
      const bot = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
      const BotToken = await ethers.getContractFactory("BotToken")
      const botToken = await BotToken.deploy();
      await botToken.deployed()
      const botTokenAddress = botToken.address
      const fundraiser = await Fundraiser.deploy(accepted, targets, bot.address , botTokenAddress , {gasLimit: 10000000});
      await fundraiser.deployed()
      return { owner , otherAccount , botToken , fundraiser};
    }
  
    describe("Deployment", function () {

      it("Should deploy properly", async function () {
        const { owner , otherAccount, botToken , fundraiser } = await loadFixture(deployFundraiser);
        expect(await fundraiser.owner).to.equal("0");
      });

      });

  });