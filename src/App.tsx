import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostsList } from './features/posts/posts-list'
import { AddPostForm } from './features/posts/add-post-form'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddPostForm />
                <PostsList />
              </>
            }
          ></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
