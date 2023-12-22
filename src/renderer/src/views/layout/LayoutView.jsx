import { FiArrowLeft, FiMoon, FiRefreshCw, FiSun } from 'react-icons/fi'
import { Outlet } from 'react-router-dom'
import lightIcon from '../../assets/lighticon.png'

const LayoutView = ({
  isDarkMode,
  PAGES,
  activeNav,
  toggleDarkMode,
  navigate,
  refreshCombinations
}) => (
  <div id="layout" className="fluid-container">
    <div id="header">
      <div id="logo">
        <img src={lightIcon} width="30" height="30" alt="PVORG" />
        <p>PVORG</p>
      </div>
      <div id="navlinks">
        {PAGES.map((page) => (
          <a
            key={page.text}
            className={activeNav === page.text ? 'navlink active' : 'navlink'}
            href={`#${page.location}`}
          >
            {page.text}
          </a>
        ))}
      </div>
      <div id="navoperations">
        <button onClick={refreshCombinations}>
          <FiRefreshCw />
        </button>
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <button onClick={toggleDarkMode} disabled>
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </div>
    <div id="content">
      <Outlet />
    </div>
  </div>
)

export default LayoutView
