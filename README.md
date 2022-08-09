# Multi Signature Wallet

- [Multi Signature Wallet](#multi-signature-wallet)
  - [Description](#description)
  - [Preview](#preview)
    - [Wallet Account Selection](#wallet-account-selection)
    - [Dashboard](#dashboard)
    - [Transactions](#transactions)
  - [Getting Started](#getting-started)
  - [Local development perequsites](#local-development-perequsites)
  - [Statring local environment](#statring-local-environment)
  - [Scripts](#scripts)
    - [Solana](#solana)
      - [Build solana program](#build-solana-program)
      - [Deploy solana program](#deploy-solana-program)
      - [Sync idl with frontend config](#sync-idl-with-frontend-config)
      - [Sync types with frontend config](#sync-types-with-frontend-config)
      - [Prepare blockchain by invoking all above or run](#prepare-blockchain-by-invoking-all-above-or-run)
      - [Change blockchain to localhost](#change-blockchain-to-localhost)
      - [Change blockchain to devnet](#change-blockchain-to-devnet)
      - [Run tests](#run-tests)
    - [Evm](#evm)
      - [Start node](#start-node)
      - [Compile Contracts](#compile-contracts)
      - [Run Tests](#run-tests-1)
      - [Deploy contracts on localhost](#deploy-contracts-on-localhost)
      - [Deploy mock data on localhost](#deploy-mock-data-on-localhost)
    - [Frontend](#frontend)
      - [Serve frontend](#serve-frontend)
      - [Build frontend](#build-frontend)
  - [Required envs](#required-envs)
  - [Project structure](#project-structure)

## Description

Implementation of Multisignature Wallet for solana blockchain. With future multichain impelmentation planned.
##Preview

## Preview

Live Preview is available at [Live Preview](https://multisig-monorepo.vercel.app "Live Preview")

### Wallet Account Selection

![Wallet Selection](/preview/wallet_select.png?raw=true "Walllet Selection")

### Dashboard

![Preview](/preview/dashboard.png?raw=true "Dashboard")

### Transactions

![Transactions](/preview/transactions.png?raw=true "Transactions")

## Getting Started

1. Clone repo
2. Run `cd multisig-monorepo && yarn`
3. Install Solana dependencies `nx run solana:prepare`
4. Set up required values in `.env` file

Now program is ready to be deployed to blockchain and frontend to run loccaly.

## Local development perequsites

1. Solana cli installed
2. anchor_lang installed
3. (optional) `nx` cli installed (invoking commands without `npx`)
4. Node.js installed

## Statring local environment

1. Make sure solana test validator is running
2. Prepare solana package with `nx run solana:prepare`
3. Run `nx run solana:exec` to build and deploy contract and sync config files with frontend
4. Wait until contract get deployed
5. Serve frontend locally with `nx serve`

## Scripts

If `nx cli` is not installed scripts must be run with `npx nx` prefix instead of `nx`

### Solana

#### Build solana program

```
nx run solana:build
```

#### Deploy solana program

```
nx run solana:deploy
```

#### Sync idl with frontend config

```
nx run solana:sync-idl
```

#### Sync types with frontend config

```
nx run solana:sync-types
```

#### Prepare blockchain by invoking all above or run

```
nx run solana:execute
```

#### Change blockchain to localhost

```
nx run solana:enable-localhost
```

#### Change blockchain to devnet

```
nx run solana:enable-devnet
```

#### Run tests

```
nx run solana:test
```

### Evm

#### Start node

```
nx run evm:node
```

#### Compile Contracts

```
nx run evm:compile
```

#### Run Tests

```
nx run evm:test
```

#### Deploy contracts on localhost

```
nx run evm:deploy
```

#### Deploy mock data on localhost

```
nx run evm:mock
```

### Frontend

#### Serve frontend

```
nx run serve
```

#### Build frontend

```
nx run build
```

## Required envs

Required Environment Values are shown in `env.example` file

| ENV                    | Description                   | Example Values        |
| ---------------------- | ----------------------------- | --------------------- |
| NEXT_PUBLIC_NETWORK    | Address to blockchain network | http://127.0.0.1:8899 |
| NEXT_PUBLIC_COMMITMENT | Connection commitment         | processed             |

## Project structure

```
multisig-monorepo/
├─ tools/
├─ packages/
│  ├─ frontend/
│  │  ├─ solana-config/
│  │  │  ├─ <idl and types>
│  ├─ solana/
│  │  ├─ <anchor_solana_app>
new_folder/
├─ solana-config/
│  │  │  ├─ <idl and types>
```
