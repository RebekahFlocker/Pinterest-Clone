import './Header.css'
import homeImage from '../../assets/pinLogo.jpg'


function Header({ activePage, onNavigate }) {
  return (
    <header className="header">
      <button
        className="brand-name"
        type="button"
        onClick={() => onNavigate('home')}
      >
        <img
          className="brand-logo"
          src={homeImage}
        />
        <span>Pinterest Clone</span>
      </button>
      <nav className="nav-bar">
        <button
          className="nav-link"
          type="button"
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        
        <button
          className="nav-link"
          type="button"
          onClick={() => onNavigate('messages')}
        >
          Messages
        </button>
        
        <button
          className="nav-link"
          type="button"
          onClick={() => onNavigate('profile')}
        >
          Profile
        </button>
      </nav>
    </header>
  )
}

export default Header