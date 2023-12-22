const ImageSlideShowView = ({ galleryImages, index }) => (
  <div className="container-slider">
    {galleryImages.map((url, imgIndex) => (
      <div className={imgIndex === index ? 'slide active' : 'slide'} key={imgIndex}>
        {imgIndex === index && <img src={url} className="image" />}
      </div>
    ))}
  </div>
)

export default ImageSlideShowView
