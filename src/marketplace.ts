import { AskCancel, AskNew, AskUpdate, Trade } from "../generated/Marketplace/Marketplace"
import { Ask, Monster } from "../generated/schema"
import { ADDRESS_ZERO_STRING, ZERO_BI } from "./constants"

export function handleAskNew(event: AskNew): void {
    const id = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())
    createAsk(id)

    let ask = Ask.load(id)

    if (ask !== null) {
        ask.collection = event.params.collection.toHexString()
        ask.tokenId = event.params.tokenId
        ask.seller = event.params.seller.toHexString()
        ask.price = event.params.askPrice
        ask.token = event.params.token.toHexString()
        ask.active = true
        ask.newTxHash = event.transaction.hash.toHexString()

        ask.save()
    }

    const monsterId = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())
    const monster = Monster.load(monsterId)

    if (monster !== null) {
        monster.status = "ON_SALE"
        monster.save()
    }
}

export function handleAskUpdate(event: AskUpdate): void {
    const id = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())

    let ask = Ask.load(id)

    if (ask !== null) {
        ask.price = event.params.askPrice

        ask.save()
    }
}

export function handleAskCancel(event: AskCancel): void {
    const id = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())

    let ask = Ask.load(id)

    if (ask !== null) {
        ask.active = false
        ask.cancelled = true
        ask.cancelTxHash = event.transaction.hash.toHexString()

        const txs = ask.updateTxsHash
        if (txs !== null) {
            if (!txs.includes(event.transaction.hash.toHexString())) {
                txs.push(event.transaction.hash.toHexString())
                ask.updateTxsHash = txs
            }
        }

        ask.save()
    }

    const monsterId = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())
    const monster = Monster.load(monsterId)

    if (monster !== null) {
        monster.status = "HOLDED"
        monster.save()
    }
}

export function handleTrade(event: Trade): void {
    const id = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())

    let ask = Ask.load(id)

    if (ask !== null) {
        ask.buyer = event.params.buyer.toHexString()
        ask.netPrice = event.params.netPrice
        ask.withBNB = event.params.withBNB
        ask.active = false
        ask.matched = true
        ask.tradeTxHash = event.transaction.hash.toHexString()

        ask.save()
    }

    const monsterId = event.params.collection.toHexString().concat("#").concat(event.params.tokenId.toString())
    const monster = Monster.load(monsterId)

    if (monster !== null) {
        monster.status = "HOLDED"
        monster.save()
    }
}

function createAsk(id: string): void {
    let ask = Ask.load(id)

    if (ask == null) {
        ask = new Ask(id)
        ask.collection = ADDRESS_ZERO_STRING
        ask.tokenId = ZERO_BI
        ask.seller = ADDRESS_ZERO_STRING
        ask.buyer = ADDRESS_ZERO_STRING
        ask.price = ZERO_BI
        ask.netPrice = ZERO_BI
        ask.token = ADDRESS_ZERO_STRING
        ask.active = false
        ask.cancelled = false
        ask.matched = false
        ask.withBNB = false
        ask.updateTxsHash = []

        ask.save()
    }
}