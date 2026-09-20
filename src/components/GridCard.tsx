import ContentCard from './ContentCard'

interface GridCardProps {
  image: string
  title: string
  summary: string
  tags: string[]
  date: string
  selected?: boolean
  onClick?: () => void
}

export default function GridCard(props: GridCardProps) {
  return <ContentCard {...props} featured={false} />
}
