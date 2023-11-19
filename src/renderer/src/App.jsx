import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import Home from './pages/Home.jsx'
import Videos from './pages/Videos.jsx'
import Galleries from './pages/Galleries.jsx'
import Tags from './pages/Tags.jsx'
import Video from './pages/Video.jsx'

function App() {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route element={<Layout />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/video/:videoPath" element={<Video />} />
          <Route exact path="/videos" element={<Videos />} />
          <Route exact path="/galleries" element={<Galleries />} />
          <Route exact path="/tags" element={<Tags />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
