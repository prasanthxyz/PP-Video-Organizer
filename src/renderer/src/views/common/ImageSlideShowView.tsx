import { Carousel } from 'rsuite'

const ImageSlideShowView = ({ galleryImages }: { galleryImages: string[] }): JSX.Element => (
  <Carousel autoplay autoplayInterval={3000}>
    {galleryImages.map((img: string) => (
      <img key={img} src={img} style={{ objectFit: 'contain' }} />
    ))}
  </Carousel>
)

export default ImageSlideShowView
