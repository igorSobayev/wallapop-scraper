import VError from 'verror'
import scrapeIt from 'scrape-it'

export default async function scrap({ link }) {
    if (!link) {
        throw VError('link to scrap is missing')
    }

    try {

        const { data } = await scrapeIt(link, {
            title: ".item-detail_ItemDetail__title__wcPRl",
            views: `[aria-label="Views"]`,
            favs: `[aria-label="Favorites"]`,
            price: '.item-detail-price_ItemDetailPrice--standard__TxPXr',
            delivery: {
                selector: '[aria-label="Shipping available"]',
                how: 'html',
            } ,
            deliveryInfo: {
                selector: '.item-detail-value-proposition_ValueProposition__deliveryTime__PnbCq', // TODO
                how: 'html',
            },
            location: '.item-detail-location_ItemDetailLocation__link__s4oPx',
            description: '.item-detail_ItemDetail__description__7rXXT',
            sold: {
                selector: '.item-detail-flags_ItemDetailFlags--midNegative__v5cBP',
                how: 'html',
            },
            reserved: {
                selector: '.item-detail-flags_ItemDetailFlags--midBlue__R1Wwl', // TODO
                how: 'html'
            },
        })

        const productData = {
            title: data.title,
            views: data.views,
            favs: data.favs,
            price: data.price.slice(0, -2),
            delivery: Boolean(data.delivery),
            deliveryInfo: data.deliveryInfo, // TODO
            location: data.location,
            description: data.description,
            sold: Boolean(data.sold),
        }
    
        return productData

    } catch (e) {
        throw VError(e)
    }
}
