import connectMongo from './connectMongo'
import crypto from 'crypto'
import assert from 'assert'
import Logger from './Logger'

class SessionHandler {

  constructor() {
    this.salt = 'sjAI012laobvm'
    this.cookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
    this.log = new Logger()
  }

  use = (handlerName) => (req, res) => {
    this.req = req
    this.res = res
    this[handlerName](req, res)
  }

  post = async (req, res) => {
    try {
      await this.connect()
      const token = req.cookies.token

      if (token !== undefined) {
        res.status(403).send('Already has a session')
      } else {
        const {
          body: {
            username,
            password
          },
          ip
        } = req

        if (!username || !password || !ip) {
          res.status(400).send('Username or password is not set')
        } else {
          const session = await this.createSession(username, password, ip)
          if (session) {
            const { sessionToken, user } = session
            res.cookie('token', sessionToken, this.cookieOptions)
            res.json(user)

          }
        }
      }

    } catch (err) {
      res.status(500).send('Internal server error')
      this.log.error(err)
    } finally {
      this.client && this.client.close()
    }
  }

  get = async (req, res) => {
    try {
      await this.connect()
      const token = req.cookies.token

      if (token === undefined) {
        res.sendStatus(204)
      } else {
        const session = await this.sessions.findOne({ token: token })

        if (!session) {
          res.cookie('token', '', { expires: new Date() })
          res.sendStatus(204)
          return
        } else {
          const user = await this.admins.findOne({ _id: session.adminId })
          if (!user) {
            res.status(404).send('User related with the session is not found')
          } else {
            const { email, firstName, lastName, phone } = user
            res.json({ email, firstName, lastName, phone })
          }
        }
      }
    } catch (err) {
      res.status(500).send('Internal server error')
      this.log.error(err)

    } finally {
      this.client && this.client.close()
    }
  }

  delete = async (req, res) => {
    try {
      await this.connect()
      const token = req.cookies.token

      if (token === undefined) {
        res.status(400).send('Has no session')
      } else {
        const session = await this.sessions.findOne({ token: token })

        if (!session) {
          res.status(404).send('Session not found')
          return
        } else {
          res.cookie('token', '', { expires: new Date() })
          const removedSessions = await this.sessions.deleteOne({ _id: session._id })
          assert.equal(1, removedSessions.deletedCount)

          res.send('Session successfuly destroyed')
        }
      }
    } catch (err) {
      res.status(500).send('Internal server error')
      this.log.error(err)
    } finally {
      this.client && this.client.close()
    }
  }

  connect = async () => {
    try {
      this.client = await connectMongo()
      const db = this.client.db('blog')
      this.sessions = db.collection('sessions')
      this.admins = db.collection('admins')
    } catch (err) {
      throw err
    }
  }

  createSession = async (username, password, ip) => {

    const hashedPassword = this.getHashedPassword(password)

    try {
      const user = await this.admins.findOne({ password: hashedPassword, username: username })

      if (!user) {
        this.res.status(404).send('User not found')
        this.client.close()
        return null
      } else {
        const sessionToken = this.generateSessionToken()

        const insertResult = await this.sessions.insertOne({ adminId: user._id, adminIP: ip, startedAt: new Date(), token: sessionToken })

        assert.equal(1, insertResult.insertedCount)

        const { email, firstName, lastName, phone } = user

        return {
          sessionToken,
          user: {
            email,
            firstName,
            lastName,
            phone
          }
        }
      }
    } catch (err) {
      throw err
    }
  }

  generateSessionToken = () => {
    const rand = crypto.randomBytes(5).toString('hex')
    const hash = crypto.createHash('sha256')
    hash.update(`${rand}${this.salt}`)
    return hash.digest('hex').toUpperCase()
  }

  getHashedPassword = (password) => {
    const hash = crypto.createHash('sha256')
    hash.update(`${password}${this.salt}`)
    return hash.digest('hex')
  }
}

export default SessionHandler