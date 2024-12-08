import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { userLoggedOut } from '@/features/auth/auth-slice'

export const Navbar = () => {
  const dispatch = useAppDispatch()

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/posts">Posts</Link>
            <button onClick={() => dispatch(userLoggedOut())}>Log out</button>
          </div>
        </div>
      </section>
    </nav>
  )
}
