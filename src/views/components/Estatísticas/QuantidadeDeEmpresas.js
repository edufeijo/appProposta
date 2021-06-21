import StatsHorizontal from '@components/widgets/stats/StatsVertical'
import { Compass } from 'react-feather'

const QuantidadeDeEmpresas = props => {
  const { quantidadeDeEmpresas } = props

  return (
    <StatsHorizontal icon={<Compass size={21} />} color='info' stats={String(quantidadeDeEmpresas)} statTitle='Quantidade de Empresas' />
  )
}

export default QuantidadeDeEmpresas
