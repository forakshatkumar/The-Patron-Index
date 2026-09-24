import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout () {
  return (
    <div className='app-layout'>
      <Sidebar />

      <div className='app-content'>
        <Header />

        <main className='page-content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
