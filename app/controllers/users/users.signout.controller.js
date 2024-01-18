
export default async function signout (req, res) {
  try {
    req.session = null
    res.status(200).send({ message: `You've been signed out!` })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}
