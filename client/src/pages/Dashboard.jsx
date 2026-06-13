import { useParams } from 'react-router-dom'

export default function Dashboard() {
  const { username } = useParams()

  return <h1>Welcome, {username}</h1>
}