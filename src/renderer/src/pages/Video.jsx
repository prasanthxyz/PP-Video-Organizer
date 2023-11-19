import * as React from 'react'
import { useParams } from 'react-router'

export default function Video() {
  let { videoPath } = useParams()
  return <h1>Video: {videoPath}</h1>
}
