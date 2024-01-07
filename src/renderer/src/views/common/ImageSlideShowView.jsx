import { Carousel } from 'rsuite'

const ImageSlideShowView = ({ galleryImages }) => (
  <Carousel autoplay autoplayInterval={3000}>
    {galleryImages.map((img) => (
      <img key={img} src={img} loading="lazy" style={{ objectFit: 'contain' }} />
    ))}
  </Carousel>
)

export default ImageSlideShowView
