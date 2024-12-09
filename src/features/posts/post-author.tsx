import { useAppSelector } from '@/app/hooks'
import { selectUserById } from '../users/users-slice'

interface PostAuthorProps {
  userId: string
  showPrefix?: boolean
}

export const PostAuthor = ({ userId, showPrefix = true }: PostAuthorProps) => {
  const author = useAppSelector(state => selectUserById(state, userId))

  return (
    <span>
      {showPrefix ? 'by ' : null}
      {author?.name ?? 'Unknown author'}
    </span>
  )
}