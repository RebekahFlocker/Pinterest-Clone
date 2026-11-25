import { useState } from 'react'
import DMs from './Comp/Chat/DMs.jsx'
import Home from './Comp/Home+Feed/Home.jsx'
import Header from './Comp/Nav Bar/Header.jsx'
import User from './Comp/Profile/User.jsx'

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {activePage === 'home' && <Home />}
      {activePage === 'messages' && <DMs />}
      {activePage === 'profile' && <User />}
    </div>
  )
}

export default App
