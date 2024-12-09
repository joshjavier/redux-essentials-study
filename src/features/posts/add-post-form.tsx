import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCurrentUsername } from '../auth/auth-slice'
import { addNewPost } from './posts-slice'

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
  const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>('idle')

  const dispatch = useAppDispatch()
  const userId = useAppSelector(selectCurrentUsername)!

  const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    const form = e.currentTarget

    try {
      setAddRequestStatus('pending')
      await dispatch(addNewPost({ title, content, user: userId })).unwrap()

      form.reset()
    } catch (err) {
      console.error('Failed to save the post: ', err)
    } finally {
      setAddRequestStatus('idle')
    }
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id='postTitle' defaultValue='' required />
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          defaultValue=''
          required
        />
        <button>Save Post</button>
      </form>
    </section>
  )
}
