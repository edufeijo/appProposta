import StatsHorizontal from '@components/widgets/stats/StatsVertical'
import { FileText } from 'react-feather'

const QuantidadeDePropostas = props => {
  const { quantidadeDePropostas } = props

  return (
    <StatsHorizontal icon={<FileText size={21} />} color='info' stats={String(quantidadeDePropostas)} statTitle='Quantidade de Propostas' />
  )
}

export default QuantidadeDePropostas
