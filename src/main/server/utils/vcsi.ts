import ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'
import { Duration } from 'luxon'
import * as os from 'os'
import * as path from 'path'

export async function generateTgp(
  videoPath: string,
  imgDir: string,
  duration: number,
  cols: number,
  rows: number,
  width: number
): Promise<void> {
  const imgName = path.basename(videoPath) + '.jpg'
  const numTiles = cols * rows
  const timeSlice = Math.floor((duration * 1000) / numTiles)
  const offset = Math.floor(timeSlice / 2)

  const snapshots: string[] = []
  const streams: string[] = []
  const layouts: string[] = []
  for (let i = 0; i < numTiles; i++) {
    const snapshotPath = path.join(os.tmpdir(), `${imgName}.${i}.png`)
    snapshots.push(snapshotPath)
    streams.push(`[${i}:v]`)
    layouts.push(getFfmpegLayoutString(i, cols))
    await generateSnapshot(
      Duration.fromMillis(offset + i * timeSlice).toFormat('h:m:s'),
      snapshotPath,
      videoPath
    )
  }

  await generateTiledImage(snapshots, streams, layouts, cols, width, path.join(imgDir, imgName))
}

async function generateSnapshot(
  timestamp: string,
  outputPath: string,
  inputPath: string
): Promise<void> {
  if (fs.existsSync(outputPath)) {
    console.log(`Snapshot already exists: ${outputPath}`)
    return
  }

  return new Promise((resolve, reject) => {
    ffmpeg()
      .addOption('-ss', timestamp)
      .addOption('-i', inputPath)
      .addOption('-frames:v', '1')
      .on('end', () => {
        resolve()
      })
      .on('error', (e) => {
        reject(e)
      })
      .save(outputPath)
  })
}

function getFfmpegLayoutString(index: number, cols: number): string {
  const col = index % cols
  const row = Math.floor(index / cols)

  const colLayout: string[] = []
  if (col === 0) {
    colLayout.push('0')
  } else {
    for (let j = 0; j < col; j++) {
      colLayout.push('w0')
    }
  }

  const rowLayout: string[] = []
  if (row === 0) {
    rowLayout.push('0')
  } else {
    for (let j = 0; j < row; j++) {
      rowLayout.push('h0')
    }
  }
  return `${colLayout.join('+')}_${rowLayout.join('+')}`
}

async function generateTiledImage(
  snapshotPaths: string[],
  streams: string[],
  layouts: string[],
  cols: number,
  width: number,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()

    for (const snapshotPath of snapshotPaths) {
      ffmpegCommand.input(snapshotPath)
    }

    ffmpegCommand
      .addOption('-y')
      .addOption(
        '-filter_complex',
        `${streams.join('')}xstack=inputs=${
          snapshotPaths.length
        }:layout=${layouts.join('|')}[v];[v]scale=${Math.floor(cols * width)}:-1[scaled]`
      )
      .addOption('-map', '[scaled]')
      .on('end', () => {
        resolve()
      })
      .on('error', (e) => {
        reject(e)
      })
      .save(outputPath)
  })
}
