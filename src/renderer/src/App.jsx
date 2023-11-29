import { HashRouter, Route, Routes } from 'react-router-dom'
import Galleries from './pages/Galleries.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Tag from './pages/Tag.jsx'
import Tags from './pages/Tags.jsx'
import Video from './pages/Video.jsx'
import Videos from './pages/Videos.jsx'

function App() {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route element={<Layout />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/video/:videoPath" element={<Video />} />
          <Route exact path="/videos" element={<Videos />} />
          <Route path="/gallery/:galleryPath" element={<Gallery />} />
          <Route exact path="/galleries" element={<Galleries />} />
          <Route path="/tag/:tagTitle" element={<Tag />} />
          <Route exact path="/tags" element={<Tags />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
