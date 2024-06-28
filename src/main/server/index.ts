import cors from '@koa/cors'
import Koa from 'koa'
import parser from 'koa-bodyparser'
import router from './routes'
import { setupDB } from './utils/data'

const app = new Koa()
export const startBackendServer = (): void => {
  setupDB()
  app.use(parser()).use(cors()).use(router.routes()).listen(3000)
}
