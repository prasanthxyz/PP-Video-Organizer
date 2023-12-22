import ImageSlideShow from '../../components/ImageSlideShow'
import VideoPlayer from '../../components/VideoPlayer'

const RPSView = ({ showVid, videoPath, isVideoPlaying, gallery, video }) => (
  <div id="homecontent">
    <div className="width75">
      {showVid ? (
        <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${videoPath}`} />
      ) : (
        <img src={`file:///${video.data.tgpPath}`} />
      )}
    </div>
    <div className="width25">
      {gallery.data.images.length > 0 && <ImageSlideShow galleryImages={gallery.data.images} />}
    </div>
  </div>
)

export default RPSView
