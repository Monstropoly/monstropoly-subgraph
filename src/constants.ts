import { Address, BigInt } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO_STRING = "0x0000000000000000000000000000000000000000"
export const ADDRESS_ZERO = Address.fromHexString(ADDRESS_ZERO_STRING)
export const ZERO_BI = BigInt.fromI32(0)