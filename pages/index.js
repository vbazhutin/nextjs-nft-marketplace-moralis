import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"

export default function Home() {
    const { isWeb3Enabled, account } = useMoralis()
    const { data: listedNFTs, isFetching: fetchingListedNFTs } = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )
    console.log(listedNFTs)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNFTs ? (
                        <div>Loading...</div>
                    ) : listedNFTs.length == 0 ? (
                        <div>No NFTs listed</div>
                    ) : (
                        listedNFTs.map((nft) => {
                            console.log(nft.attributes)
                            const { price, nftAddress, tokenId, marketPlaceAddress, seller } =
                                nft.attributes
                            return (
                                <div>
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        seller={seller}
                                        marketPlaceAddress={marketPlaceAddress}
                                        key={`${nftAddress}/${tokenId}`}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
