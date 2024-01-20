
export default function generateTag() {
    let tag = '';

    const arr = '123456789abcdefghijklmnopqrstuvwxyz'

    for (let i = 6; i > 0; i--) {
        tag += arr[(Math.floor(Math.random() * arr.length))]
    }

    return tag
}
