import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from '~/components/atoms/nav_link'
import { Link } from '~/components/atoms/link'

export function Header() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = (_?: any) => {
    setIsMenuOpen(false)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  const menuState = isMenuOpen ? 'opened' : 'closed'
  const isExpanded = isMenuOpen ? 'true' : 'false'

  return (
    <header className="header" data-state={menuState} aria-expanded={isExpanded}>
      <Link route="page.home" className="header__logo font-semibold tracking-wide text-xl font-cormorant" onClick={closeMenu}>
        Floralia <span className="text-secondary italic">Atelier</span>
      </Link>

      <nav
        id="primary-navigation"
        className="header__nav"
        data-state={menuState}
        aria-expanded={isExpanded}
      >
        <NavLink route={'page.home'} anchor="services" label="Services" variant="nav" onClick={closeMenu} />
        <NavLink route={'page.home'} anchor="about" label="Histoire" variant="nav" onClick={closeMenu} />
        <NavLink route={'page.home'} anchor="creations" label="Créations" variant="nav" onClick={closeMenu} />
        <NavLink route={'page.home'} anchor="contact" label="Contact" variant="nav" onClick={closeMenu} />
      </nav>
      <button
        className="header__burger md:display-hidden"
        aria-controls="primary-navigation"
        aria-expanded={isExpanded}
        data-state={menuState}
        aria-label={t('header.menu_label')}
        onClick={toggleMenu}
      >
        <svg
          stroke="currentColor"
          fill="none"
          className="hamburger"
          viewBox="-10 -10 120 120"
          width="50"
        >
          <path
            className="line"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m 20 40 h 60 a 1 1 0 0 1 0 20 h -60 a 1 1 0 0 1 0 -40 h 30 v 70"
          ></path>
        </svg>
      </button>
    </header>
  )
}
