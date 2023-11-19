import * as React from 'react'
import { Link } from 'react-router-dom'

export default function VideoRow({ videoPath }) {
  return (
    <div>
      <Link to={`/video/${videoPath}`}>{videoPath}</Link>
    </div>
  )
}
