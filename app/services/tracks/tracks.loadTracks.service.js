import VError from 'verror'
import mongoose from 'mongoose'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'

export default async function loadTracks({ userId }) {
    if (!userId) {
        throw VError('userId is missing on upload track elements')
    }

    const user = await UserModel.findOne({ _id: userId })

    if (!user && user.deleted) {
        throw VError('User is missing or deleted')
    }

    // Agregado para obtener Tracks con su último historial
    const tracks = await TrackModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                deleted: false,
                archived: false,
            }
        },
        {
            $lookup: {
                from: 'trackhistories',
                localField: '_id',
                foreignField: 'trackId',
                as: 'historial'
            }
        },
        {
            $addFields: {
                lastElement: { $arrayElemAt: ['$historial', -1] }
            }
        },
        {
            $project: {
                historial: 0
            }
        }
    ])

    return tracks
}
