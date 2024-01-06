import { Carousel } from 'rsuite'

const ImageSlideShowView = ({ galleryImages }) => (
  <Carousel autoplay autoplayInterval={3000}>
    {galleryImages.map((img) => (
      <img key={img} src={img} loading="lazy" width="100%" style={{ objectFit: 'contain' }} />
    ))}
  </Carousel>
)

export default ImageSlideShowView
