import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

/**
 * PUBLIC_INTERFACE
 * Header component that renders the site logo/title and navigation.
 * Includes accessible semantics and keyboard-focusable links.
 */
export default function Header() {
  return (
    <header className="tg-header" role="banner" aria-label="Travel Guide site header">
      <div className="tg-container tg-header__inner">
        <Link to="/" className="tg-brand" aria-label="Travel Guide Home">
          <span className="tg-logo" aria-hidden="true">🧭</span>
          <span className="tg-brand__text">Travel Guide</span>
        </Link>
        <nav className="tg-nav" role="navigation" aria-label="Main navigation">
          <ul className="tg-nav__list">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/explore"
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Explore
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
