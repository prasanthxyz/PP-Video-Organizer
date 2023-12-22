import * as React from 'react'
import ImageSlideShowView from '../views/common/ImageSlideShowView'

export default function ImageSlideShow({ galleryImages }) {
  const [index, setIndex] = React.useState(0)
  const length = galleryImages.length

  const nextSlide = () => {
    setIndex(index === length - 1 ? 0 : index + 1)
  }

  const prevSlide = () => {
    setIndex(index === 0 ? length - 1 : index - 1)
  }

  React.useEffect(() => {
    if (galleryImages.length > 0) {
      const interval = setTimeout(() => {
        nextSlide()
      }, 2000)

      return () => clearTimeout(interval)
    }
  }, [index])

  return galleryImages.length === 0 ? (
    <></>
  ) : (
    <ImageSlideShowView galleryImages={galleryImages} index={index} />
  )
}
