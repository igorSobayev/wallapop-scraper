import VError from 'verror'

export default function buildLoggedUser ({ user, token }) {
    if (!user) {
        throw VError('user is missing')
    }

    if (!token) {
        throw VError('token is missing')
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
        trackUpdatePreference: user.trackUpdatePreference,
        jwt_token: token
    }
}
