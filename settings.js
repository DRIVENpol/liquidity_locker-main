import LOCKER_ABI_ from "./abi/lockerAbi.json";
import TOKEN_ABI_ from "./abi/tokenAbi.json";
import OWNABLE_ABI_ from "./abi/ownableAbi.json";

const IS_LIVE = true;
const LOCKER_TESTNET_ADDRESS = "0xe8c22E7ADB5C960951b1d1f6E7D1a5992d24eA9e";
const LOCKER_MAINNET_ADDRESS = "0x92F17751FB3c48e38BC0e9E6bfd0eF87938cF170";

const MAINNET_ID = 56;
const TESTNET_ID = 97;

export const LOCKER_ABI = LOCKER_ABI_;
export const TOKEN_ABI = TOKEN_ABI_;
export const OWNABLE_ABI = OWNABLE_ABI_;
export const LOCKER_ADDRESS = IS_LIVE ? LOCKER_MAINNET_ADDRESS : LOCKER_TESTNET_ADDRESS;
export const CHAIN_ID = IS_LIVE ? MAINNET_ID : TESTNET_ID;

export const CHAINBASE_API_KEY = "2RvNVwZDGC1c6VrVHF4JqLzqSBT"