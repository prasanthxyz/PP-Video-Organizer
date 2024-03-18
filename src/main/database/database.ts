import * as fs from 'fs';
import * as path from 'path';
import { parse, stringify } from 'yaml';
import { IVideoModel } from './VideoModel';

export interface IData {
  galleries: string[];
  tags: string[];
  videoGalleries: [string, string][];
  videoTags: [string, string][];
  videos: IVideoModel[];
}

export let data: IData;
let configFile: string;

export async function setupDB(app: Electron.App): Promise<void> {
  configFile = path.join(app.getPath('home'), 'pvorg.yml');
  if (!fs.existsSync(configFile)) {
    data = {
      galleries: [],
      tags: [],
      videoGalleries: [],
      videoTags: [],
      videos: [],
    };
    storeData();
  } else {
    loadData();
  }
}

export function loadData() {
  const file = fs.readFileSync(configFile, 'utf8');
  data = parse(file);
}

export function storeData() {
  fs.writeFileSync(configFile, stringify(data));
}
