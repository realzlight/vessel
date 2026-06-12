import { useParams } from 'react-router-dom'

export default function Dashboard() {
  const { name } = useParams()

  return <h1>Welcome, {name}</h1>
}