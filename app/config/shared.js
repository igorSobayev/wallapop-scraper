// Shared params
const config = {
    ROLES: {
        'USER': 'user',
        'ADMIN': 'admin',
    },
    PLANS: {
        'FREE': 'free',
        'MEDIUM': 'medium',
        'PREMIUM': 'premium',
    },
    PLANS_DETAILS: {
        'free': {
            'MAX_TRACKS': 5,
        },
        'medium': {
            'MAX_TRACKS': 30,
        },
        'premium': {
            'MAX_TRACKS': 100,
        },
    },
    PLANS_CONFIG: {
        'DAILY': 'daily',
        'TWICE': 'twice',
        'SIX_HOURS': 'six_hours',
        'THREE_HOURS': 'three_hours',
        'ONE_HOUR': 'one_hour',
    },
    AVAILABLE_PLATFORMS: {
        'WALLAPOP': 'wallapop',
    },
    EXCLUDED_USER_FIELDS: '-password -email -role -deleted -__v',
}

export default config