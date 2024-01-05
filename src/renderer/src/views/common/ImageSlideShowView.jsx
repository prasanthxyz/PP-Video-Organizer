import { Carousel } from 'antd'

const ImageSlideShowView = ({ galleryImages }) => (
  <Carousel autoplay>
    {galleryImages.map((img) => (
      <img key={img} src={img} loading="lazy" width="100%" />
    ))}
  </Carousel>
)

export default ImageSlideShowView
