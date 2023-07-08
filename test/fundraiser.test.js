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
      const MockToken = await ethers.getContractFactory("MockToken")
      const SampleBot = await ethers.getContractFactory("SampleBot")
  
      const mockToken = await MockToken.deploy()
      await mockToken.deployed()
      const mockTokenAddress  = mockToken.address
      // accepted tokens
      const acceptedTokens = [mockTokenAddress]
      // target amounts
      const targetAmounts = [ethers.utils.parseEther("10000000")];
      // reward rates
      const rewardRates = [1];
      // bot token address
      const BotToken = await ethers.getContractFactory("BotToken")
      const botToken = await BotToken.deploy();
      await botToken.deployed()
      const botTokenAddress = botToken.address
      // bot address
      const sampleBot = await SampleBot.deploy()
      await sampleBot.deployed()
      const botAddress = sampleBot.address
      // deployment
      const fundraiser = await Fundraiser.deploy(acceptedTokens, targetAmounts, rewardRates, botAddress , botTokenAddress , {gasLimit: 10000000});
      await fundraiser.deployed()
      await botToken.transferOwnership(fundraiser.address)
      return { owner , botToken , mockToken ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress, sampleBot};
    }
  
    describe("Deployment", function () {

      it("should deploy", async function () {
        const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
      });
      
      it("should set the correct owner", async () => {
        const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        expect(await fundraiser.owner()).to.equal(owner.address);
      });
    
      it("should set the correct bot address", async () => {
        const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        expect(await fundraiser.bot()).to.equal(botAddress);
      });
    
      it("should set the correct accepted tokens", async () => {
        const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        const tokenCount = acceptedTokens.length;
        for (let i = 0; i < tokenCount; i++) {
          const tokenAddress = acceptedTokens[i];
          expect(await fundraiser.acceptedTokens(i)).to.equal(tokenAddress);
        }
      });
    
      it("should set the correct bot token", async () => {
        const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        expect(await fundraiser.botToken()).to.equal(botToken.address);
      });
    
      it("should set the correct reward rates for each token", async () => {
        const { owner , botToken  , mockToken ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
        const tokenCount = acceptedTokens.length;
        for (let i = 0; i < tokenCount; i++) {
          const tokenAddress = acceptedTokens[i];
          const rewardRate = rewardRates[i];
          expect(await fundraiser.tokenRewardRate(tokenAddress)).to.equal(rewardRate);
        }
      });

      });

      describe("Receive funds", function () {

        it("should send whitelisted tokens ", async function () {
          const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
          // No need to mint as handled in the mock contract
          // Get the balance of the sending account before sending tokens (optional)
          // Call the contract function that accepts tokens
          const amountToSend = ethers.utils.parseEther("10");
          await mockToken.connect(owner).approve(fundraiser.address, amountToSend);
          await fundraiser.receiveFunds(mockToken.address , amountToSend , {gasLimit: 10000000});
        });

        it("should update user balance in fund ", async function () {
          const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
          const amountToSend = ethers.utils.parseEther("10");
          await mockToken.connect(owner).approve(fundraiser.address, amountToSend);
          await fundraiser.receiveFunds(mockToken.address , amountToSend , {gasLimit: 10000000});
          expect(await fundraiser.participantBalance(owner.address , mockToken.address)).to.equal(ethers.utils.parseEther("10"));
        });

        it("should revert on target hit", async function () {
          const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress} = await loadFixture(deployFundraiser);
          const amountToSend = ethers.utils.parseEther("10000000");
          await mockToken.connect(owner).approve(fundraiser.address, amountToSend);
          await fundraiser.receiveFunds(mockToken.address , amountToSend , {gasLimit: 10000000});
          // target hit
          const amountToSend2 = ethers.utils.parseEther("1");
          await mockToken.connect(owner).approve(fundraiser.address, amountToSend2);
          await expect(fundraiser.receiveFunds(mockToken.address , amountToSend2 , {gasLimit: 10000000})).to.be.revertedWith("Target for token already hit");
        });
        
        });

        describe("Withdraw funds", function () {

          it("should withdraw funds to bot", async function () {
            const { owner , botToken , mockToken  ,fundraiser , acceptedTokens , targetAmounts, rewardRates, botAddress , botTokenAddress , sampleBot} = await loadFixture(deployFundraiser);
            const amountToSend = ethers.utils.parseEther("10000000");
            await mockToken.connect(owner).approve(fundraiser.address, amountToSend);
            await fundraiser.receiveFunds(mockToken.address , amountToSend , {gasLimit: 10000000});
            const tokenBalance = await mockToken.balanceOf(fundraiser.address);
            console.log(tokenBalance)
            await fundraiser.withdrawFundsToBot()
            const botBalance = await mockToken.balanceOf(sampleBot.address);
            console.log(botBalance) 
            expect(botBalance).to.equal(ethers.utils.parseEther("10000000"))
          });
        
          });

  });