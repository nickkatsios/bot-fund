const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  
  describe("Staking", function () {

    async function deployStaking() {
      const [owner, otherAccount] = await ethers.getSigners();
      const Pool = await ethers.getContractFactory("StakingPool")
      const MockToken = await ethers.getContractFactory("MockToken")
      const BotToken = await ethers.getContractFactory("BotToken")
      const SampleBot = await ethers.getContractFactory("SampleBot")

      // Mock token to be used as rewards ex USDT
      const mockToken = await MockToken.deploy()
      await mockToken.deployed()
      const mockTokenAddress  = mockToken.address

      // Bot token to be used as staking token
      const botToken = await BotToken.deploy();
      await botToken.deployed()
      const botTokenAddress = botToken.address

      const stakingPool = await Pool.deploy(botToken.address , mockToken.address)
      await stakingPool.deployed()
      // set reward duration
      await stakingPool.setRewardsDuration(1000)
      // send reward token to pool
      await mockToken.transfer(stakingPool.address , ethers.utils.parseEther("100"))
      // send reward token to stakeholder
      await botToken.transfer(otherAccount.address , ethers.utils.parseEther("50"))
      // add the rewards tokens to the pool and notify contract
      await stakingPool.notifyRewardAmount(ethers.utils.parseEther("100"))
      // stake 50 bot tokens to staking pool as a stakeholder
      await botToken.connect(otherAccount).approve(stakingPool.address, ethers.utils.parseEther("50"));
      await stakingPool.connect(otherAccount).stake(ethers.utils.parseEther("50"))


      // bot address
      const sampleBot = await SampleBot.deploy()
      await sampleBot.deployed()
      const botAddress = sampleBot.address
      // deployment
      return { owner , otherAccount, botToken , mockToken , mockTokenAddress, botAddress , botTokenAddress, sampleBot , stakingPool};
    }
  
    describe("Staking", function () {

      it("should set the correct staking and reward tokens", async function () {
        const { botToken , mockToken , stakingPool} = await loadFixture(deployStaking);
        expect(await stakingPool.stakingToken()).to.equal(botToken.address);
        expect(await stakingPool.rewardsToken()).to.equal(mockToken.address);
      });

      it("should store the token amount staked by the user", async function () {
        const {otherAccount, stakingPool} = await loadFixture(deployStaking);
        expect(await stakingPool.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("50"));
      });

      it("should reward user with earned rewards token", async function () {
        const {otherAccount, stakingPool} = await loadFixture(deployStaking);
        // 2 blocks have passed
        await ethers.provider.send("evm_mine", []);
        // so the reward should be 0.2 of rewards token
        expect(await stakingPool.earned(otherAccount.address)).to.equal(ethers.utils.parseEther("0.2"));
      });

    });
})