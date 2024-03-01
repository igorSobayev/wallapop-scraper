import VError from 'verror'
import scrapeIt from 'scrape-it'

import Utils from '../../../utils'

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
                selector: '[role="status"]',
                how: 'html',
            },
            reserved: {
                selector: '[role="status"]', // TODO
                how: 'html'
            },
            previewImg: {
                selector: 'div.mx-3:nth-child(1)',
                attr: 'style'
            }
        })

        const rawPrice =  _formatPrice(data.price)

        const previewImg = _getPreviewImg(data.previewImg)

        const rawViews = Utils.kNumbersFormatter(data.views)

        const rawFavs = Utils.kNumbersFormatter(data.favs)

        const productData = {
            title: data.title,
            views: rawViews,
            favs: rawFavs,
            price: Number(rawPrice),
            delivery: Boolean(data.delivery),
            deliveryInfo: data.deliveryInfo, // TODO
            location: data.location,
            description: data.description,
            sold: Boolean(data.sold?.includes('Vendido')),
            reserved: Boolean(data.reserved), // TODO
            previewImg,
        }
    
        return productData

    } catch (e) {
        // If the product was deleted from the platform
        if (e.response.status === 404) {
            return {
                deletedFromPlatform: true
            }
        }

        throw VError(e)
    }
}

function _getPreviewImg (img) {
    // Expresión regular para encontrar la URL entre paréntesis y hasta el signo de interrogación
    const regex = /url\((.*?)\?/

    // Aplicar la expresión regular al string
    const match = img.match(regex)

    // Si hay un match, la URL estará en el grupo de captura (match[1])
    if (match && match[1]) {
        return match[1]
    } else {
        return ''
    }
}

function _formatPrice (rawPrice) {
    return rawPrice.slice(0, -2).replace(',', '.')
}