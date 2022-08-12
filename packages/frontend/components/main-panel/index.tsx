import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Input } from "..";
import { toast } from "react-toastify";
import autoAnimate from "@formkit/auto-animate";
import { cloneDeep } from "lodash";
import {
  AppDispatch,
  loadWalletData,
  ReduxState,
  RootState,
  setOwners,
  setTreshold,
  transfer,
} from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { PublicKey } from "@solana/web3.js";
import useMediaQuery from "../../hooks/useMediaQuery";
import { trimAddress } from "../../utils/trimAddress";

export const MainPanel = () => {
  const matches = useMediaQuery("(min-width: 768px)");
  const dispatch = useDispatch<AppDispatch>();
  const { connection, wallet, evm } = useSelector<RootState, ReduxState>(
    (state) => state
  );
  const { msig, provider, program } = connection;
  const { accounts: accs, threshold } = wallet;
  const [confirmations, setConfirmations] = useState<number>(0);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [receiver, setReceiver] = useState<string>("");
  const [accountInput, setAccountInput] = useState("");
  const removeAccount = (acc: string) => {
    setAccounts(accounts.filter((_) => _ !== acc));
  };
  const addAccount = () => {
    setAccounts([...accounts, accountInput.trim()]);
    setAccountInput("");
  };
  const handleChangeConfirmations = () => {
    if (typeof confirmations === "number") {
      dispatch(setTreshold({ threshold: confirmations }));
    } else {
      toast.error("Please enter a number");
    }
  };
  const handleChangeAccounts = async () => {
    if (connection.chain === "sol") {
      await dispatch(
        setOwners({
          additionalAccounts: accounts.map((_) => new PublicKey(_)),
          signer: provider.wallet.publicKey,
        })
      );
    } else {
      await dispatch(
        setOwners({
          additionalAccounts: accounts,
        })
      );
    }
  };
  const handleSendTokens = async () => {
    if (typeof amount === "number") {
      if (connection.chain === "sol") {
        await dispatch(transfer({ to: new PublicKey(receiver), amount }));
      } else {
        await dispatch(transfer({ to: receiver, amount }));
      }
    } else {
      toast.error("Please enter a number");
    }
  };
  const parent = useRef(null);
  // effects
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (accs) {
      setAccounts(cloneDeep(accs.map((_) => _.toString())));
    }
    if (threshold) {
      setConfirmations(threshold);
    }
  }, [accs]);
  return (
    <div className="flex flex-col justify-center gap-10">
      <div className="p-2 rounded bg-purple-300 border border-slate-300 shadow-xl bg-opacity-60 hover:shadow-2xl duration-300 ">
        <h1 className="text-2xl font-semibold text-white  mb-4">
          Change Required Confirmations
        </h1>
        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Number of required confirmations
            <span className="text-white"> Currently set to {threshold}</span>
          </span>
          <Input
            onChange={(e) => setConfirmations(Number(e))}
            value={String(confirmations)}
            placeholder="Set Confirmations..."
          />
        </div>
        <Button
          label="Confirm"
          onClick={handleChangeConfirmations}
          disabled={threshold === confirmations}
        />
      </div>

      <div className="p-2 rounded bg-purple-300 border border-slate-300 shadow-xl bg-opacity-60 hover:shadow-2xl duration-300">
        <h1 className="text-2xl mb-4 font-semibold text-white ">Send Tokens</h1>
        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Amount to transfer{" "}
            {connection.chain === "sol" ? "(In Lamports)" : "(In Wei)"}
          </span>
          <Input
            onChange={(e) => setAmount(Number(e))}
            value={String(amount)}
            placeholder="Amount"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Receiver Address
          </span>
          <Input
            onChange={(e) => setReceiver(e.trim())}
            value={receiver}
            placeholder="Receiver Address"
          />
        </div>
        <Button
          label="Confirm"
          onClick={handleSendTokens}
          disabled={
            amount === 0 ||
            isNaN(amount) ||
            receiver.length > 44 ||
            receiver.length < 32
          }
        />
      </div>

      <div className="rounded p-2 bg-purple-300 border border-slate-300 shadow-xl bg-opacity-60 hover:shadow-2xl duration-300">
        <h1 className="text-2xl mb-4 font-semibold text-white ">
          Manage Accounts
        </h1>
        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Account Address
          </span>
          <div className="flex flex-row  items-center gap-10">
            <Input
              onChange={(e) => setAccountInput(e)}
              value={accountInput}
              placeholder="Add account..."
            />

            <Button
              onClick={addAccount}
              label="Add"
              disabled={accountInput.length > 44 || accountInput.length < 32}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full mb-2" ref={parent}>
          <span className="text-sm text-purple-900 font-semibold">
            Account List:
          </span>
          {accounts &&
            accounts.map((acc, i) => (
              <Card key={i}>
                <>
                  {console.log(evm.wallet)}
                  {console.log(acc)}
                  <span className="leading-10 mr-4">
                    {matches ? acc : trimAddress(acc)}
                    {((connection.chain === "sol" &&
                      acc.toString() ===
                        connection.provider.publicKey.toString()) ||
                      (connection.chain === "eth" &&
                        acc.toLowerCase() === evm.wallet.toLowerCase())) && (
                      <span className="text-white font-bold"> (me)</span>
                    )}
                    {!accs
                      .map((_) => _.toString())
                      .includes(acc.toString()) && (
                      <span className="text-white font-bold"> (Temporary)</span>
                    )}
                  </span>
                  {((connection.chain === "sol" &&
                    acc.toString() !==
                      connection.provider.publicKey.toString()) ||
                    (connection.chain === "eth" &&
                      acc.toLowerCase() !== evm.wallet.toLowerCase())) && (
                    <Button
                      onClick={() => removeAccount(acc)}
                      label={matches ? "Remove" : "X"}
                    />
                  )}
                </>
              </Card>
            ))}
        </div>
        <Button
          label="Confirm Changes"
          onClick={handleChangeAccounts}
          disabled={
            accounts &&
            accs &&
            accounts.map((acc) => acc.toString()).join("") ===
              accs.map((acc) => acc.toString()).join("")
          }
        />
      </div>
    </div>
  );
};
