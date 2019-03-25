import express from 'express'
import SessionHandler from './SessionHandler'



const apiRouter = express.Router()


const sessionHandler = new SessionHandler()


apiRouter
  .post('/session', sessionHandler.use('post'))
  .get('/session', sessionHandler.use('get'))
  .delete('/session', sessionHandler.use('delete'))

export default apiRouter