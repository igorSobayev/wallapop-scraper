
export default function buildHistoryObject ({ oldTrack }) {

    return {
        user: oldTrack.user,
        trackId: oldTrack._id,
        title: oldTrack.title,
        views: oldTrack.views,
        favs: oldTrack.favs,
        price: oldTrack.price,
        delivery: oldTrack.delivery,
        deliveryInfo: oldTrack.deliveryInfo,
        location: oldTrack.location,
        description: oldTrack.description,
        sold: oldTrack.sold,
        reserved: oldTrack.reserved,
        previewImg: oldTrack.previewImg,
        updateDate: oldTrack.updateDate,
    }
}
