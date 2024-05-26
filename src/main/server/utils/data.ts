import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { parse, stringify } from 'yaml'
import { IVideoModel } from '../../../types'

export let data: IData
const configFile = path.join(os.homedir(), 'pvorg.yml')

interface IData {
  galleries: string[]
  tags: string[]
  videoGalleries: [string, string][]
  videoTags: [string, string][]
  videos: IVideoModel[]
}

export async function setupDB(): Promise<void> {
  if (!fs.existsSync(configFile)) {
    data = {
      galleries: [],
      tags: [],
      videoGalleries: [],
      videoTags: [],
      videos: []
    }
    storeData()
  } else {
    loadData()
  }
}

export function storeData(): void {
  fs.writeFileSync(configFile, stringify(data))
}

function loadData(): void {
  const file = fs.readFileSync(configFile, 'utf8')
  data = parse(file)
}
