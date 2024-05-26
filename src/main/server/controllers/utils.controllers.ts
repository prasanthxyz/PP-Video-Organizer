import { sync as isCommandExisting } from 'command-exists'
import { Context } from 'koa'

export function getExecutablesStatus(ctx: Context): void {
  ctx.body = [isCommandExisting('ffmpeg')]
}
