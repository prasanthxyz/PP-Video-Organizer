import { Carousel } from 'antd'

const ImageSlideShowView = ({ galleryImages }) => (
  <Carousel autoplay>
    {galleryImages.map((img) => (
      <img key={img} src={img} width="100%" />
    ))}
  </Carousel>
)

export default ImageSlideShowView
