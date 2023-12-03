import React from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { ArrowLeft, ToggleOff, ToggleOn } from 'react-bootstrap-icons'
import { useHotkeys } from 'react-hotkeys-hook'
import { Outlet, useNavigate } from 'react-router-dom'
import lightIcon from '../assets/lighticon.png'
import darkIcon from '../assets/darkicon.png'

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [activeNav, setActiveNav] = React.useState('Random')

  const navigate = useNavigate()

  useHotkeys('Shift+R', () => navigate('/'))
  useHotkeys('Shift+V', () => navigate('/videos'))
  useHotkeys('Shift+G', () => navigate('/galleries'))
  useHotkeys('Shift+T', () => navigate('/tags'))

  const updateNav = (e) => setActiveNav(e.target.text)

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-bs-theme')
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    }
    setIsDarkMode(!isDarkMode)
  }

  return (
    <>
      <Navbar className="bg-body-secondary px-3">
        <Navbar.Brand>
          <img
            src={isDarkMode ? darkIcon : lightIcon}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="PVORG"
          />
          &nbsp;&nbsp;PVORG
        </Navbar.Brand>
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <Nav.Link className="me-2" onClick={updateNav} active={activeNav === 'Random'} href="#/">
            Random
          </Nav.Link>
          <Nav.Link
            className="me-2"
            onClick={updateNav}
            active={activeNav === 'Videos'}
            href="#/videos"
          >
            Videos
          </Nav.Link>
          <Nav.Link
            className="me-2"
            onClick={updateNav}
            active={activeNav === 'Galleries'}
            href="#/galleries"
          >
            Galleries
          </Nav.Link>
          <Nav.Link
            className="me-2"
            onClick={updateNav}
            active={activeNav === 'Tags'}
            href="#/tags"
          >
            Tags
          </Nav.Link>
        </Nav>
        <Button size="sm" className="d-flex me-2" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <Button
          size="sm"
          variant={isDarkMode ? 'light' : 'dark'}
          className="d-flex"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <ToggleOn /> : <ToggleOff />}
        </Button>
      </Navbar>
      <Container fluid>
        <Outlet />
      </Container>
    </>
  )
}
