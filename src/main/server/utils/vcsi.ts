import ffmpeg from 'fluent-ffmpeg'
import { Duration } from 'luxon'
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

  const timestamps: string[] = []
  const streams: string[] = []
  const layouts: string[] = []
  for (let i = 0; i < numTiles; i++) {
    timestamps.push(Duration.fromMillis(offset + i * timeSlice).toFormat('h:m:s'))
    streams.push(`[${i}:v]`)
    layouts.push(getFfmpegLayoutString(i, cols))
  }

  await generateTiledImage(
    videoPath,
    timestamps,
    streams,
    layouts,
    cols,
    width,
    path.join(imgDir, imgName)
  )
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
  inputPath: string,
  timestamps: string[],
  streams: string[],
  layouts: string[],
  cols: number,
  width: number,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()

    for (const timestamp of timestamps) {
      ffmpegCommand.addOption('-ss', timestamp)
      ffmpegCommand.addOption('-i', inputPath)
    }

    ffmpegCommand
      .addOption('-frames:v', '1')
      .addOption('-y')
      .addOption(
        '-filter_complex',
        `${streams.join('')}xstack=inputs=${
          timestamps.length
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
