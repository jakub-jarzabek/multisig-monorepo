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

export declare namespace MultisigFactory {
  export type UserWalletsStruct = {
    walletAddress: PromiseOrValue<string>;
    walletID: PromiseOrValue<BigNumberish>;
  };

  export type UserWalletsStructOutput = [string, BigNumber] & {
    walletAddress: string;
    walletID: BigNumber;
  };
}

export interface MultisigFactoryInterface extends utils.Interface {
  functions: {
    "createMultiSig(address[],uint256)": FunctionFragment;
    "getUserWallets()": FunctionFragment;
    "multisigInstances(uint256)": FunctionFragment;
    "wallets(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createMultiSig"
      | "getUserWallets"
      | "multisigInstances"
      | "wallets"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createMultiSig",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserWallets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "multisigInstances",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "wallets",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "createMultiSig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserWallets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "multisigInstances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "wallets", data: BytesLike): Result;

  events: {
    "multisigInstanceCreated(uint256,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "multisigInstanceCreated"): EventFragment;
}

export interface multisigInstanceCreatedEventObject {
  date: BigNumber;
  walletOwner: string;
  multiSigAddress: string;
}
export type multisigInstanceCreatedEvent = TypedEvent<
  [BigNumber, string, string],
  multisigInstanceCreatedEventObject
>;

export type multisigInstanceCreatedEventFilter =
  TypedEventFilter<multisigInstanceCreatedEvent>;

export interface MultisigFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MultisigFactoryInterface;

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
    createMultiSig(
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getUserWallets(
      overrides?: CallOverrides
    ): Promise<
      [MultisigFactory.UserWalletsStructOutput[]] & {
        walets: MultisigFactory.UserWalletsStructOutput[];
      }
    >;

    multisigInstances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    wallets(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber] & { walletAddress: string; walletID: BigNumber }
    >;
  };

  createMultiSig(
    _owners: PromiseOrValue<string>[],
    _threshold: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getUserWallets(
    overrides?: CallOverrides
  ): Promise<MultisigFactory.UserWalletsStructOutput[]>;

  multisigInstances(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  wallets(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber] & { walletAddress: string; walletID: BigNumber }
  >;

  callStatic: {
    createMultiSig(
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getUserWallets(
      overrides?: CallOverrides
    ): Promise<MultisigFactory.UserWalletsStructOutput[]>;

    multisigInstances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    wallets(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber] & { walletAddress: string; walletID: BigNumber }
    >;
  };

  filters: {
    "multisigInstanceCreated(uint256,address,address)"(
      date?: null,
      walletOwner?: null,
      multiSigAddress?: null
    ): multisigInstanceCreatedEventFilter;
    multisigInstanceCreated(
      date?: null,
      walletOwner?: null,
      multiSigAddress?: null
    ): multisigInstanceCreatedEventFilter;
  };

  estimateGas: {
    createMultiSig(
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getUserWallets(overrides?: CallOverrides): Promise<BigNumber>;

    multisigInstances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    wallets(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createMultiSig(
      _owners: PromiseOrValue<string>[],
      _threshold: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getUserWallets(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    multisigInstances(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    wallets(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
