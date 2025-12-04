import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import NotificationsBell from './NotificationsBell';

/**
 * PUBLIC_INTERFACE
 * Header component that renders the site logo/title and navigation.
 * Includes accessible semantics and keyboard-focusable links.
 * Adds a notifications bell with unread badge and dropdown panel.
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
            <li>
              <NavLink
                to="/currency"
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Currency
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reviews"
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/safety"
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Safety
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notifications"
                className={({ isActive }) => isActive ? 'tg-nav__link is-active' : 'tg-nav__link'}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                Notifications
              </NavLink>
            </li>
            <li aria-label="Open notifications menu" style={{ display: 'flex', alignItems: 'center' }}>
              <NotificationsBell />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
