import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { ArrowLeft, ArrowRepeat, ToggleOff, ToggleOn } from 'react-bootstrap-icons'
import { Outlet } from 'react-router-dom'
import darkIcon from '../../assets/darkicon.png'
import lightIcon from '../../assets/lighticon.png'

const LayoutView = ({
  isDarkMode,
  PAGES,
  activeNav,
  toggleDarkMode,
  navigate,
  refreshCombinations
}) => (
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
      <Button size="sm" variant="warning" className="d-flex me-2" onClick={refreshCombinations}>
        <ArrowRepeat />
      </Button>
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

export default LayoutView
