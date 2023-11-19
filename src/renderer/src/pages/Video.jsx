import * as React from 'react'
import { useParams } from 'react-router'

export default function Video() {
  let { videoPath } = useParams()
  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')

  const getImgPath = () => {
    const imgPathComponents = videoPathComponents.slice(0, videoPathComponents.length - 1)
    imgPathComponents.push('img')
    imgPathComponents.push(videoPathComponents[videoPathComponents.length - 1] + '.jpg')
    return imgPathComponents.join('/')
  }

  const imgPath = getImgPath()
  return <img src={`file:///${imgPath}`} />
}
