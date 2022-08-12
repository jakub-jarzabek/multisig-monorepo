/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace Multisig {
  export type TxStruct = {
    createdAt: PromiseOrValue<BigNumberish>;
    txHash: PromiseOrValue<BytesLike>;
    index: PromiseOrValue<BigNumberish>;
    to: PromiseOrValue<string>;
    value: PromiseOrValue<BigNumberish>;
    data: PromiseOrValue<BytesLike>;
    didExecute: PromiseOrValue<boolean>;
    isDeleted: PromiseOrValue<boolean>;
    signers: PromiseOrValue<string>[];
    owners: PromiseOrValue<string>[];
    threshold: PromiseOrValue<BigNumberish>;
    txType: PromiseOrValue<BigNumberish>;
    confirmationsCount: PromiseOrValue<BigNumberish>;
  };

  export type TxStructOutput = [
    BigNumber,
    string,
    BigNumber,
    string,
    BigNumber,
    string,
    boolean,
    boolean,
    string[],
    string[],
    BigNumber,
    number,
    BigNumber
  ] & {
    createdAt: BigNumber;
    txHash: string;
    index: BigNumber;
    to: string;
    value: BigNumber;
    data: string;
    didExecute: boolean;
    isDeleted: boolean;
    signers: string[];
    owners: string[];
    threshold: BigNumber;
    txType: number;
    confirmationsCount: BigNumber;
  };
}

export interface MultisigInterface extends utils.Interface {
  functions: {
    "addTransaction(address,uint256,bytes,address[],uint256,uint8)": FunctionFragment;
    "approveTransaction(uint256)": FunctionFragment;
    "deleteTransaction(uint256)": FunctionFragment;
    "executeTransaction(uint256)": FunctionFragment;
    "getOwners()": FunctionFragment;
    "getTransaction(uint256)": FunctionFragment;
    "getTransactionCount()": FunctionFragment;
    "getTransactions()": FunctionFragment;
    "isApprovedByOwner(uint256,address)": FunctionFragment;
    "isApprovedBySender(uint256)": FunctionFragment;
    "isOwner(address)": FunctionFragment;
    "owners(uint256)": FunctionFragment;
    "revokeApproval(uint256)": FunctionFragment;
    "threshold()": FunctionFragment;
    "transactions(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addTransaction"
      | "approveTransaction"
      | "deleteTransaction"
      | "executeTransaction"
      | "getOwners"
      | "getTransaction"
      | "getTransactionCount"
      | "getTransactions"
      | "isApprovedByOwner"
      | "isApprovedBySender"
      | "isOwner"
      | "owners"
      | "revokeApproval"
      | "threshold"
      | "transactions"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addTransaction",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "approveTransaction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteTransaction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeTransaction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "getOwners", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getTransaction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTransactionCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTransactions",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedByOwner",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedBySender",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "owners",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeApproval",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "threshold", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transactions",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approveTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTransactionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTransactions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedByOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedBySender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeApproval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "threshold", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transactions",
    data: BytesLike
  ): Result;

  events: {
    "ApproveTransaction(address,uint256)": EventFragment;
    "DeleteTransaction(address,uint256)": EventFragment;
    "Deposit(address,uint256,uint256)": EventFragment;
    "ExecuteTransaction(address,uint256)": EventFragment;
    "NewTransaction(address,uint256,address,uint256,bytes,uint8)": EventFragment;
    "UnApproveTransaction(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApproveTransaction"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DeleteTransaction"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExecuteTransaction"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewTransaction"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnApproveTransaction"): EventFragment;
}

export interface ApproveTransactionEventObject {
  owner: string;
  txIndex: BigNumber;
}
export type ApproveTransactionEvent = TypedEvent<
  [string, BigNumber],
  ApproveTransactionEventObject
>;

export type ApproveTransactionEventFilter =
  TypedEventFilter<ApproveTransactionEvent>;

export interface DeleteTransactionEventObject {
  owner: string;
  txIndex: BigNumber;
}
export type DeleteTransactionEvent = TypedEvent<
  [string, BigNumber],
  DeleteTransactionEventObject
>;

export type DeleteTransactionEventFilter =
  TypedEventFilter<DeleteTransactionEvent>;

export interface DepositEventObject {
  sender: string;
  value: BigNumber;
  balance: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface ExecuteTransactionEventObject {
  owner: string;
  txIndex: BigNumber;
}
export type ExecuteTransactionEvent = TypedEvent<
  [string, BigNumber],
  ExecuteTransactionEventObject
>;

export type ExecuteTransactionEventFilter =
  TypedEventFilter<ExecuteTransactionEvent>;

export interface NewTransactionEventObject {
  owner: string;
  txIndex: BigNumber;
  to: string;
  value: BigNumber;
  data: string;
  txType: number;
}
export type NewTransactionEvent = TypedEvent<
  [string, BigNumber, string, BigNumber, string, number],
  NewTransactionEventObject
>;

export type NewTransactionEventFilter = TypedEventFilter<NewTransactionEvent>;

export interface UnApproveTransactionEventObject {
  owner: string;
  txIndex: BigNumber;
}
export type UnApproveTransactionEvent = TypedEvent<
  [string, BigNumber],
  UnApproveTransactionEventObject
>;

export type UnApproveTransactionEventFilter =
  TypedEventFilter<UnApproveTransactionEvent>;

export interface Multisig extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MultisigInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addTransaction(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      _txType: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    approveTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deleteTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getOwners(overrides?: CallOverrides): Promise<[string[]]>;

    getTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, string, boolean, BigNumber] & {
        to: string;
        value: BigNumber;
        data: string;
        didExecute: boolean;
        confirmationsCount: BigNumber;
      }
    >;

    getTransactionCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getTransactions(
      overrides?: CallOverrides
    ): Promise<[Multisig.TxStructOutput[]]>;

    isApprovedByOwner(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isApprovedBySender(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    revokeApproval(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    threshold(overrides?: CallOverrides): Promise<[BigNumber]>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        BigNumber,
        string,
        BigNumber,
        string,
        boolean,
        boolean,
        BigNumber,
        number,
        BigNumber
      ] & {
        createdAt: BigNumber;
        txHash: string;
        index: BigNumber;
        to: string;
        value: BigNumber;
        data: string;
        didExecute: boolean;
        isDeleted: boolean;
        threshold: BigNumber;
        txType: number;
        confirmationsCount: BigNumber;
      }
    >;
  };

  addTransaction(
    _to: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    _data: PromiseOrValue<BytesLike>,
    _owners: PromiseOrValue<string>[],
    _threshold: PromiseOrValue<BigNumberish>,
    _txType: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  approveTransaction(
    _txIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deleteTransaction(
    _txIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeTransaction(
    _txIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getOwners(overrides?: CallOverrides): Promise<string[]>;

  getTransaction(
    _txIndex: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, string, boolean, BigNumber] & {
      to: string;
      value: BigNumber;
      data: string;
      didExecute: boolean;
      confirmationsCount: BigNumber;
    }
  >;

  getTransactionCount(overrides?: CallOverrides): Promise<BigNumber>;

  getTransactions(
    overrides?: CallOverrides
  ): Promise<Multisig.TxStructOutput[]>;

  isApprovedByOwner(
    arg0: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isApprovedBySender(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isOwner(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owners(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  revokeApproval(
    _txIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  threshold(overrides?: CallOverrides): Promise<BigNumber>;

  transactions(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      string,
      BigNumber,
      string,
      BigNumber,
      string,
      boolean,
      boolean,
      BigNumber,
      number,
      BigNumber
    ] & {
      createdAt: BigNumber;
      txHash: string;
      index: BigNumber;
      to: string;
      value: BigNumber;
      data: string;
      didExecute: boolean;
      isDeleted: boolean;
      threshold: BigNumber;
      txType: number;
      confirmationsCount: BigNumber;
    }
  >;

  callStatic: {
    addTransaction(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      _txType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    approveTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    deleteTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    executeTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getOwners(overrides?: CallOverrides): Promise<string[]>;

    getTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, string, boolean, BigNumber] & {
        to: string;
        value: BigNumber;
        data: string;
        didExecute: boolean;
        confirmationsCount: BigNumber;
      }
    >;

    getTransactionCount(overrides?: CallOverrides): Promise<BigNumber>;

    getTransactions(
      overrides?: CallOverrides
    ): Promise<Multisig.TxStructOutput[]>;

    isApprovedByOwner(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isApprovedBySender(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    revokeApproval(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    threshold(overrides?: CallOverrides): Promise<BigNumber>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        BigNumber,
        string,
        BigNumber,
        string,
        boolean,
        boolean,
        BigNumber,
        number,
        BigNumber
      ] & {
        createdAt: BigNumber;
        txHash: string;
        index: BigNumber;
        to: string;
        value: BigNumber;
        data: string;
        didExecute: boolean;
        isDeleted: boolean;
        threshold: BigNumber;
        txType: number;
        confirmationsCount: BigNumber;
      }
    >;
  };

  filters: {
    "ApproveTransaction(address,uint256)"(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): ApproveTransactionEventFilter;
    ApproveTransaction(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): ApproveTransactionEventFilter;

    "DeleteTransaction(address,uint256)"(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): DeleteTransactionEventFilter;
    DeleteTransaction(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): DeleteTransactionEventFilter;

    "Deposit(address,uint256,uint256)"(
      sender?: PromiseOrValue<string> | null,
      value?: null,
      balance?: null
    ): DepositEventFilter;
    Deposit(
      sender?: PromiseOrValue<string> | null,
      value?: null,
      balance?: null
    ): DepositEventFilter;

    "ExecuteTransaction(address,uint256)"(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): ExecuteTransactionEventFilter;
    ExecuteTransaction(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): ExecuteTransactionEventFilter;

    "NewTransaction(address,uint256,address,uint256,bytes,uint8)"(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null,
      to?: PromiseOrValue<string> | null,
      value?: null,
      data?: null,
      txType?: null
    ): NewTransactionEventFilter;
    NewTransaction(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null,
      to?: PromiseOrValue<string> | null,
      value?: null,
      data?: null,
      txType?: null
    ): NewTransactionEventFilter;

    "UnApproveTransaction(address,uint256)"(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): UnApproveTransactionEventFilter;
    UnApproveTransaction(
      owner?: PromiseOrValue<string> | null,
      txIndex?: PromiseOrValue<BigNumberish> | null
    ): UnApproveTransactionEventFilter;
  };

  estimateGas: {
    addTransaction(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      _txType: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    approveTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deleteTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getOwners(overrides?: CallOverrides): Promise<BigNumber>;

    getTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTransactionCount(overrides?: CallOverrides): Promise<BigNumber>;

    getTransactions(overrides?: CallOverrides): Promise<BigNumber>;

    isApprovedByOwner(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedBySender(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    revokeApproval(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    threshold(overrides?: CallOverrides): Promise<BigNumber>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addTransaction(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      _txType: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    approveTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deleteTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getOwners(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTransaction(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTransactionCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTransactions(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isApprovedByOwner(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedBySender(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isOwner(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    revokeApproval(
      _txIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    threshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transactions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
