import React from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { ArrowLeft, ToggleOff, ToggleOn } from 'react-bootstrap-icons'
import { useHotkeys } from 'react-hotkeys-hook'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import darkIcon from '../assets/darkicon.png'
import lightIcon from '../assets/lighticon.png'

const PAGES = [
  { text: 'Random', shortcut: 'Shift+R', location: '/', prefix: '/' },
  { text: 'Videos', shortcut: 'Shift+V', location: '/videos', prefix: '/video' },
  { text: 'Galleries', shortcut: 'Shift+G', location: '/galleries', prefix: '/galler' },
  { text: 'Tags', shortcut: 'Shift+T', location: '/tags', prefix: '/tag' }
]

const getActiveNav = (location) => {
  for (let i = 1; i < PAGES.length; i++) {
    if (location.startsWith(PAGES[i].prefix)) return PAGES[i].text
  }
  return 'Random'
}

export default function Layout() {
  const location = useLocation().pathname
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [activeNav, setActiveNav] = React.useState(getActiveNav(location))

  React.useEffect(() => {
    setActiveNav(getActiveNav(location))
  }, [location])

  const navigate = useNavigate()

  for (const page of Object.values(PAGES)) {
    useHotkeys(page.shortcut, () => {
      navigate(page.location)
    })
  }

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
          {PAGES.map((page) => (
            <Nav.Link
              key={page.text}
              className="me-2"
              active={activeNav === page.text}
              href={`#${page.location}`}
            >
              {page.text}
            </Nav.Link>
          ))}
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
