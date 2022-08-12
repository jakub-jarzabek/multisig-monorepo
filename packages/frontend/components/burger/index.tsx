import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Dropdown } from "@web3uikit/core";
import {
  AppDispatch,
  Connection,
  Evm,
  ReduxState,
  RootState,
  Wallet,
} from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMoralis } from "react-moralis";

export const Burger = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { connection } = useSelector<RootState, ReduxState>((state) => state);
  const options = [
    { label: "Solana", id: "sol" },
    { label: "Ethereum", id: "eth" },
  ];
  const router = useRouter();
  const { account } = useMoralis();
  const wallet = useWallet();
  console.log(wallet);
  console.log(account);
  if (!wallet.publicKey && !account) {
    return (
      <Menu isOpen={open} onStateChange={(state) => setOpen(state.isOpen)}>
        <div className="flex flex-col">
          <h1 className="text-xl text-wite font-semibold tracking-wider mb-4">
            Select Blockchain
          </h1>
          <Dropdown
            defaultOptionIndex={0}
            width="200px"
            selectedState={options.findIndex(
              (option) => option.id === connection.chain
            )}
            onChange={(e) => {
              dispatch(Connection.setChain(e.id as "sol" | "eth"));
              setOpen(false);
            }}
            options={options}
          />
        </div>
      </Menu>
    );
  }
  return <></>;
};
