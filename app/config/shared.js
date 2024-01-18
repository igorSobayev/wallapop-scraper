// Shared params
const config = {
    ROLES: {
        'USER': 'user',
        'ADMIN': 'admin',
    },
    EXCLUDED_USER_FIELDS: '-password -email -role -deleted -__v',
    EXCLUDED_RECIPE_FIELDS: '-onProgress -deleted -deletedDate -deletedBy -deleted -__v',
}

export default config