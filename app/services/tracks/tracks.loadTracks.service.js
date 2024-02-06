import VError from 'verror'
import mongoose from 'mongoose'

import shared from './../../config/shared.js'

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

    const aggregate = [
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
        }
    ]

    if (user.plan !== shared.PLANS.PREMIUM) {
        aggregate.push(
            {
                $addFields: {
                    lastElement: { $arrayElemAt: ['$historial', -1] }
                }
            }
        )

        aggregate.push(
            {
                $project: {
                    historial: 0
                }
            }
        )
    }

    // Agregado para obtener Tracks con su último historial
    const tracks = await TrackModel.aggregate(aggregate)

    return tracks
}
