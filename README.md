# BitsoSwap – Gasless Token Swap dApp

BitsoSwap is a decentralized application (dApp) built with Next.js, Wagmi, and ZeroDev that allows users to **swap ERC-20 tokens on Sepolia testnet** without holding any ETH. 

## Features

- Connect wallet and automatically create a smart account
- Gasless token swaps using ZeroDev kernel accounts and sponsored paymaster
- Supports mock PEPE / USDC token swaps (1:1 ratio)
- Swap form has some validation
- Updated token balance after swap
- Displays smart account token balances in real time
- Transaction feedback with Etherscan links

- Mobile-first and responsive design

## Setup Instructions

1. **Clone the repository**  
   `git clone <https://github.com/dashakrolik/dapp-swap> && cd <dapp-swap>`

2. **Install dependencies**  
   `npm install`

3. **Start the development server**  
   `npm run dev`

**Note**: The ZeroDev projectId and WalletConnect projectId are currently hardcoded in the project. This should be stored securely in an environment variable instead and not committed to the repo. 

## Contracts Used

This dApp uses **mock Solidity contracts** that I wrote and deployed to Sepolia using Remix:

- **PEPE token** – ERC-20 with 2 decimals
- **USDC token** – ERC-20 with 2 decimals
- **MockSwap** – 1:1 swap contract for mock token pairs

The connected wallet used in development holds balances of both tokens, enabling real swaps to be executed via the mock contract. These swaps are visible on-chain and confirmed through events.

## Demo

A screen recording will be included showing how the app functions: wallet connection, balance retrieval, token swap and transaction success feedback.

## Technologies Used

- Next.js
- Wagmi and viem
- Material UI
- ZeroDev
- Solidity + Remix IDE
- Sepolia testnet

## Self-Reflection and Potential Improvements

This project fulfills all core functional requirements listed in the assignment:

1. Wallet connection with automatic smart account creation  
2. Swapping between two ERC-20 tokens (mocked)  
3. Gasless transactions fully paid via a sponsor  
4. Loading states, errors etc
5. Responsive user interface

### What could be improved

- **Refactoring + separation of concerns**: Some logic and UI components could be extracted further to make the codebase cleaner and more testable. Example: separating all form logic into a custom "useSwap()" hook, decoupling layout containers from content.
- **Reusable UI components**: Styling logic like card wrappers, buttons, and layout sections should be turned into shared components for consistency and reuse.
- **Token pricing logic**: Right now, swaps are fixed at 1:1. A simulated price preview or actual DEX integration would better reflect real-world use cases.
- **Error handling**: More precise feedback for the user during failed swaps or connection errors.
- **State management**: A global store could improve flow and avoid prop-passing.
- **Security**: Project secrets like the ZeroDev projectId should be stored securely, not hard-coded.
- **Testing**: The current implementation lacks unit and integration tests. 
- **UX**: Injectable button can be confusing to the user. Design can be more responsive (min width when making the window very narrow, better looking for desktop - e.g. not fixed width)
- **WCAG**: Accessbility should be assessed and taken into account more. Works with tab navigation but I have not assessed accessbility when it comes to contrast, font size etc.
- **Folder structure**: Folder structure can be improved
- **Typescript**: I used "any" a few times. Best practice is to not use "any" unless absolutely very necessary (which it wasn't however I was running a bit short on time :))
- **GIT**: Should have used git earlier to show a history of work with commits.
- **Setup**: Redundant packages should be deleted