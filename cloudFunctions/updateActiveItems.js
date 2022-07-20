Moralis.Cloud.afterSave("ItemListed", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed Transaction")
    if (confirmed) {
        logger.info("Found listed item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        const query = new Moralis.Query(ActiveItem)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("marketPlaceAddress", request.object.get("address"))
        query.equalTo("seller", request.object.get("seller"))
        const alreadyListedItem = await query.first()
        if (alreadyListedItem) {
            logger.info("Deleting already listed item")
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it's already been listed`
            )
            logger.info("Updating listed item...")
        }

        const activeItem = new ActiveItem()
        const address = request.object.get("address")
        const tokenId = request.object.get("tokenId")
        activeItem.set("marketPlaceAddress", address)
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("tokenId", tokenId)
        activeItem.set("price", request.object.get("price"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(`Adding Address: ${address}. TokenId: ${tokenId}`)
        logger.info("Saving...")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        logger.info("Found canceled item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        const tokenId = request.object.get("tokenId")
        const address = request.object.get("address")
        query.equalTo("marketPlaceAddress", address)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", tokenId)
        logger.info(`Marketplace | Query: ${query}`)
        const canceledItem = await query.first()
        logger.info(`Marketplace | Canceled item: ${canceledItem}`)
        if (canceledItem) {
            logger.info(`Deleting ${tokenId} at address: ${address} since it was canceled`)
            await canceledItem.destroy()
        } else {
            logger.info(`No item found with address: ${address} and tokenId: ${tokenId}`)
        }
    }
})

Moralis.Cloud.afterSave("ItemSold", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(request.object)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        const tokenId = request.object.get("tokenId")
        const address = request.object.get("address")
        query.equalTo("marketPlaceAddress", address)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", tokenId)
        logger.info(`Marketplace | Query: ${query}`)
        const soldItem = await query.first()
        if (soldItem) {
            logger.info(`Deleting ${request.object.get("objectId")}`)
            await soldItem.destroy()
            logger.info(
                `Deleted item with TokenID ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")}`
            )
        } else {
            logger.info(
                `No item found with address ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")}`
            )
        }
    }
})
