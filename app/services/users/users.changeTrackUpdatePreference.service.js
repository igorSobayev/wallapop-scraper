import VError from 'verror'

import shared from './../../config/shared.js'

import UserModel from '../../repository/users/user.model.js'

export default async function changeTrackUpdatePreference ({ userId, trackUpdatePreference }) {
    if (!userId) {
        throw VError('userId is missing')
    }
    if (!trackUpdatePreference) {
        throw VError('trackUpdatePreference is missing')
    }

    const user = await UserModel.findOne({ _id: userId, deleted: false })

    if (!user) {
        throw VError(`User with ID ${userId} is missing or is deleted`)
    }

    const response = {
        status: '',
        message: ''
    }

    switch (trackUpdatePreference) {
        case shared.PLANS_CONFIG.DAILY:
            break
        case shared.PLANS_CONFIG.TWICE:
        case shared.PLANS_CONFIG.SIX_HOURS:
            if (user.plan !== shared.PLANS.MEDIUM && user.plan !== shared.PLANS.PREMIUM) {
                response.status = 'KO'
                response.message = `You can not select this config with ${user.plan} plan`
                return response
            }
            break
        case shared.PLANS_CONFIG.THREE_HOURS:
        case shared.PLANS_CONFIG.ONE_HOUR:
            if (user.plan !== shared.PLANS.PREMIUM) {
                response.status = 'KO'
                response.message = `You can not select this config with ${user.plan} plan`
                return response
            }
            break
        default:
            response.status = 'KO'
            response.message = `The update preference ${trackUpdatePreference} is not valid`
            return response
    }


    response.status = 'OK'
    response.message = `Track update preference changed succeesfuly`

    user.trackUpdatePreference = trackUpdatePreference

    await user.save()

    return response
}