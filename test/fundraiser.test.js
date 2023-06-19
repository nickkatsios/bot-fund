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
      // accepted tokens
      const acceptedTokens = ["0xdD2FD4581271e230360230F9337D5c0430Bf44C0"]
      // target amounts
      const targetAmounts = [ethers.utils.parseEther("100")];    
      // bopt token address
      const BotToken = await ethers.getContractFactory("BotToken")
      const botToken = await BotToken.deploy();
      await botToken.deployed()
      const botTokenAddress = botToken.address
      // bot address
      const botAddress = otherAccount.address
      // deployment
      const fundraiser = await Fundraiser.deploy(acceptedTokens, targetAmounts, botAddress , botTokenAddress , {gasLimit: 10000000});
      await fundraiser.deployed()
      return { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress};
    }
  
    describe("Deployment", function () {

      it("should deploy", async function () {
        const { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
      });
      
      it("should set the correct owner", async () => {
        const { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        expect(await fundraiser.owner()).to.equal(owner.address);
      });
    
      it("should set the correct bot address", async () => {
        const { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        expect(await fundraiser.bot()).to.equal(botAddress);
      });
    
      it("should set the correct accepted tokens", async () => {
        const { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        const tokenCount = acceptedTokens.length;
        for (let i = 0; i < tokenCount; i++) {
          const tokenAddress = acceptedTokens[i];
          expect(await fundraiser.acceptedTokens(i)).to.equal(tokenAddress);
        }
      });
    
      it("should set the correct bot token", async () => {
        const { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        expect(await fundraiser.botToken()).to.equal(botToken.address);
      });
    
      it("should set the correct target amounts for tokens", async () => {
        const { owner , botToken ,fundraiser , acceptedTokens , targetAmounts, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        const tokenCount = acceptedTokens.length;
        for (let i = 0; i < tokenCount; i++) {
          const tokenAddress = acceptedTokens[i];
          const targetAmount = targetAmounts[i];
          expect(await fundraiser.targets(tokenAddress)).to.equal(targetAmount);
        }
      });

      });

  });