import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectAllPosts } from './posts-slice'
import { PostAuthor } from './post-author'
import { TimeAgo } from '@/components/time-ago'
import { ReactionButtons } from './reaction-buttons'

export const PostsList = () => {
  const posts = useAppSelector(selectAllPosts)
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  const renderedPosts = orderedPosts.map(post => (
    <article key={post.id} className="post-excerpt">
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <ReactionButtons post={post} />
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
