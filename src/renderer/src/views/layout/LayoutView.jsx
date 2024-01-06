import { FaAdjust, FaArrowLeft, FaSync } from 'react-icons/fa'
import { Outlet } from 'react-router-dom'
import { Container, Content, CustomProvider, Header, Nav, Navbar, Stack } from 'rsuite'
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
  <CustomProvider theme={isDarkMode ? 'dark' : 'light'}>
    <Header>
      <Navbar appearance="default">
        <Nav>
          <Nav.Item>
            <Stack spacing={10}>
              <img src={isDarkMode ? darkIcon : lightIcon} width={30} height={30} />
              <h4 style={{ margin: 0, textWrap: 'nowrap' }}>PVORG</h4>
            </Stack>
          </Nav.Item>
        </Nav>
        <Nav activeKey={activeNav}>
          {PAGES.map((page) => (
            <Nav.Item key={page.text} eventKey={page.text} onSelect={() => navigate(page.location)}>
              {page.text}
            </Nav.Item>
          ))}
        </Nav>
        <Nav pullRight>
          <Nav.Item onClick={refreshCombinations}>
            <FaSync />
          </Nav.Item>
          <Nav.Item onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </Nav.Item>
          <Nav.Item onClick={toggleDarkMode}>
            <FaAdjust />
          </Nav.Item>
        </Nav>
      </Navbar>
    </Header>
    <Content>
      <Container style={{ padding: '0.4rem' }}>
        <Outlet />
      </Container>
    </Content>
  </CustomProvider>
)

export default LayoutView
