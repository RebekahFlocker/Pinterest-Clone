import './Header.css'

function Header({ activePage, onNavigate }) {
  return (
    <header className="header">
      <button
        className="brand-name"
        type="button"
        onClick={() => onNavigate('home')}
      >
        <span className="brand-logo">P</span>
        <span>Pinterest Clone</span>
      </button>
      <nav className="nav-bar">
        <button
          className="nav-link"
          type="button"
          aria-current={activePage === 'home' ? 'page' : undefined}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className="nav-link"
          type="button"
          aria-current={activePage === 'messages' ? 'page' : undefined}
          onClick={() => onNavigate('messages')}
        >
          Messages
        </button>
        <button
          className="nav-link"
          type="button"
          aria-current={activePage === 'profile' ? 'page' : undefined}
          onClick={() => onNavigate('profile')}
        >
          Profile
        </button>
      </nav>
    </header>
  )
}

export default Header