import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { postUpdated, selectPostById } from './posts-slice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export const EditPostForm = () => {
  const { postId } = useParams()

  const post = useAppSelector(state => selectPostById(state, postId!))

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = (e: React.FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (title && content) {
      dispatch(postUpdated({ id: post.id, title, content }))
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          defaultValue={post.title}
          required
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          defaultValue={post.content}
          required
        />
        <button>Save Post</button>
      </form>
    </section>
  )
}