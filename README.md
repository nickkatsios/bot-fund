# Bot fund

This project proposes a way for MEV bot owners to raise funds for strategies and reward stakeholders.

## Contracts

### Fundraiser
A fundraiser contract that accepts multiple erc20 tokens with associated targets that receives funds from participants and withdraws them to the bot.

### Bot 
An MEV bot that implements strategies to make profits.

### Bot Token 
The bot token that gets minted to the user after participating in the fundraiser. Grants the stakeholder role.

### Staking pool
A simple staking pool forked by Synthetics pool contract that enables the stakeholders to stake $BOT tokens and receive rewards from the bot's profitable strategies.

## Testing
To get started an test some use cases, you can run some custom unit tests located at ```./tests```
## Steps
1. Install dependencies with npm
```shell
npm install
```
2. Start your local hardhat node
```shell
npx hardhat node
```
3. Execute the tests
```shell
npx hardhat test
```
Feel free to add new tests if needed.

## Diagram of fund flow
