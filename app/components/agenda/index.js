import Agenda from 'agenda'
import updateTracksService from '../../services/tracks/tracks.updateTracks.service.js'
import shared from '../../config/shared.js'

async function init() {
    console.log('INICIANDO AGENDA')

    const mongoConnectionString = process.env.DB_URI

    const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } })

    agenda.define('syncDaily', async job => {
        console.log('RUNNING syncDaily job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.DAILY, shared.PLANS_CONFIG.TWICE, shared.PLANS_CONFIG.SIX_HOURS, shared.PLANS_CONFIG.THREE_HOURS, shared.PLANS_CONFIG.ONE_HOUR] })
    })

    agenda.define('syncTwice', async job => {
        console.log('RUNNING syncTwice job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.TWICE, shared.PLANS_CONFIG.SIX_HOURS, shared.PLANS_CONFIG.THREE_HOURS, shared.PLANS_CONFIG.ONE_HOUR] })
    })

    agenda.define('syncSixHours', async job => {
        console.log('RUNNING syncSixHours job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.SIX_HOURS, shared.PLANS_CONFIG.THREE_HOURS, shared.PLANS_CONFIG.ONE_HOUR] })
    })

    agenda.define('syncThreeHours', async job => {
        console.log('RUNNING syncThreeHours job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.THREE_HOURS, shared.PLANS_CONFIG.ONE_HOUR] })
    })

    agenda.define('syncOneHour', async job => {
        console.log('RUNNING syncOneHour job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.ONE_HOUR] })
    })

    // IIFE to give access to async/await
    await agenda.start();
    console.log('AGENDA STARTED')

    // Run sync tracks every day at 12:00 AM (timezone: 'Europe/Madrid')
    await agenda.every('0 0 * * *', 'syncDaily', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 1 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 2 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 3 * * *', 'syncThreeHours', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 4 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 5 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 6 * * *', 'syncSixHours', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 7 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 8 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 9 * * *', 'syncThreeHours', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 10 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 11 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 12 * * *', 'syncTwice', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 13 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 14 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 15 * * *', 'syncThreeHours', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 16 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 17 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })
    await agenda.every('0 18 * * *', 'syncSixHours', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 19 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 20 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 21 * * *', 'syncThreeHours', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 22 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 23 * * *', 'syncOneHour', {
        timezone: 'Europe/Madrid',
    })
}


export default {
    init
}