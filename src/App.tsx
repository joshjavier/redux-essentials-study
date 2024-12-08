import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostsMainPage } from './features/posts/posts-main-page'
import { SinglePostPage } from './features/posts/single-post-page'
import { EditPostForm } from './features/posts/edit-post-form'
import { LoginPage } from './features/auth/login-page'
import { selectCurrentUsername } from './features/auth/auth-slice'
import { useAppSelector } from './app/hooks'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername)

  if (!username) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route
            path='/*'
            element={
              <ProtectedRoute>
                <Routes>
                <Route path="/posts" element={<PostsMainPage />} />
                <Route path='/posts/:postId' element={<SinglePostPage />} />
                <Route path='/editPost/:postId' element={<EditPostForm />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
