import { BigInt } from "@graphprotocol/graph-ts";
import { Mint, Transfer } from "../generated/Factory/Factory";
import { Monster } from "../generated/schema";
import { ADDRESS_ZERO_STRING } from "./constants";
import { handleMonsterTransfer } from "./holders";

export function handleTransfer(event: Transfer): void {
    createMonster(event.address.toHexString(), event.params.tokenId)
    handleMonsterTransfer(event)
}

export function handleMint(event: Mint): void {
    createMonster(event.address.toHexString(), event.params.tokenId)
    const id = event.address.toHexString().concat("#").concat(event.params.tokenId.toString())
    let monster = Monster.load(id)

    if (monster !== null) {
        monster.rarity = event.params.rarity
        monster.breedUses = event.params.breedUses
        monster.genetic = event.params.genetic
        monster.save()
    }
}

function createMonster(contract: string, tokenId: BigInt): void {
    const id = contract.concat("#").concat(tokenId.toString())
    let monster = Monster.load(id)

    if (monster === null) {
        monster = new Monster(id)
        monster.tokenId = tokenId
        monster.owner = ADDRESS_ZERO_STRING
        monster.rarity = 0
        monster.breedUses = 0
        monster.genetic = ""
        monster.status = "HOLDED"
        monster.save()
    }
}