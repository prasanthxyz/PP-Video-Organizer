import React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutView from '../views/layout/LayoutView'

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

export default function Layout({ refreshCombinations }) {
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
    <LayoutView
      isDarkMode={isDarkMode}
      PAGES={PAGES}
      activeNav={activeNav}
      toggleDarkMode={toggleDarkMode}
      navigate={navigate}
      refreshCombinations={refreshCombinations}
    />
  )
}
