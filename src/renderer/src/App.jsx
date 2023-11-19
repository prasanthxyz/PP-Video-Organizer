import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route element={<Layout />}>
          <Route exact path="/" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
