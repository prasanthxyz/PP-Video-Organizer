import * as React from 'react'
import { Carousel } from 'react-bootstrap'

export default function ImageSlideShow({ galleryImages }) {
  return (
    <Carousel slide={false} interval={2000} indicators={false}>
      {galleryImages.map((path) => (
        <Carousel.Item key={path}>
          <img width="100%" src={path} />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
