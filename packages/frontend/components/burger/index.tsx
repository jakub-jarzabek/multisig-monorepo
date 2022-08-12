import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Dropdown } from "@web3uikit/core";
import { AppDispatch, Connection } from "../../redux";
import { useDispatch } from "react-redux";

export const Burger = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const options = [
    { label: "Solana", id: "sol" },
    { label: "Ethereum", id: "eth" },
  ];
  return (
    <Menu isOpen={open} onStateChange={(state) => setOpen(state.isOpen)}>
      <div className="flex flex-col">
        <h1 className="text-xl text-wite font-semibold tracking-wider mb-4">
          Select Blockchain
        </h1>
        <Dropdown
          defaultOptionIndex={0}
          width="200px"
          onChange={(e) => {
            dispatch(Connection.setChain(e.id as "sol" | "eth"));
            setOpen(false);
          }}
          options={options}
        />
      </div>
    </Menu>
  );
};
