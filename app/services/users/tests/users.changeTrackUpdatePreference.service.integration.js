import { expect } from 'chai'
import changeTrackUpdatePreference from '../users.changeTrackUpdatePreference.service.js'
import UserModel from '../../../repository/users/user.model.js'
import mongoose from 'mongoose'
import shared from './../../../config/shared.js'

// TODO no funca
describe('Service - changeTrackUpdatePreference', () => {
    describe('GIVEN user and a track update preference', () => {
        before(async () => {
            await UserModel.deleteMany()
            .catch(e => {
                console.log(e)
            })
        })
        it('WHEN user have a FREE plan and select DAILY preference  THEN should update his preference', async () => {
            const userId = new mongoose.Types.ObjectId()

            const user = new UserModel({ _id: userId, plan: shared.PLANS.FREE, email: 'fake@email.com', username: 'money' })

            await user.save()

            const res = await changeTrackUpdatePreference({ userId, trackUpdatePreference: shared.PLANS_CONFIG.DAILY })

            expect(res.status).to.be.eql('OK')
        })
    })
})