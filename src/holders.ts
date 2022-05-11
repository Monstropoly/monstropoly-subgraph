import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/Factory/Factory";
import { Holder, Monster } from "../generated/schema";
import { ADDRESS_ZERO } from "./constants";

export function handleMonsterTransfer(event: Transfer): void {
    const id = event.address.toHexString().concat("#").concat(event.params.tokenId.toString())
    
    if (event.params.from.notEqual(ADDRESS_ZERO)) {
        holderPopMonster(event.params.from.toHexString(), id)
    }

    if (event.params.to.notEqual(ADDRESS_ZERO)) {
        holderPushMonster(event.params.to.toHexString(), id)
    }

    let monster = Monster.load(id)

    if (monster !== null) {
        monster.owner = event.params.to.toHexString()

        if (event.params.to.equals(ADDRESS_ZERO)) {
            monster.status = "BURNED"
        }
        
        monster.save()
    }
}

function holderPushMonster(receiver: string, id: string): void {
    createHolder(receiver)
    let holder = Holder.load(receiver)

    if (holder !== null) {
        const monsters = holder.monsters
        if (monsters !== null) {
            if (!monsters.includes(id)) {
                monsters.push(id)
                holder.monsters = monsters
                holder.save()
            }
        }
    }
}

function holderPopMonster(sender: string, id: string): void {
    createHolder(sender)
    let holder = Holder.load(sender)

    if (holder !== null) {
        const monsters = holder.monsters
        if (monsters !== null) {
            const index = monsters.indexOf(id)
            if (index > -1) {
                monsters.splice(index, 1)
            }
            holder.monsters = monsters
            holder.save()
        }
    }
}

function createHolder(address: string): void {
    let holder = Holder.load(address)

    if (holder === null) {
        holder = new Holder(address)
        holder.monsters = []
        holder.save()
    }
}