import { Post, ReactionName } from './posts-slice'
import { useAddReactionMutation } from '../api/api-slice'

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  tada: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

interface ReactionButtonsProps {
  post: Post
}

export const ReactionButtons = ({ post }: ReactionButtonsProps) => {
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([stringName, emoji]) => {
      const reaction = stringName as ReactionName
      return (
        <button
          key={reaction}
          type='button'
          className='muted-button reaction-button'
          onClick={() => addReaction({ postId: post.id, reaction })}
        >
          {emoji} {post.reactions[reaction]}
        </button>
      )
    },
  )

  return <div>{reactionButtons}</div>
}
