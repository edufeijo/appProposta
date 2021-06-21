import StatsHorizontal from '@components/widgets/stats/StatsVertical'
import { Smile } from 'react-feather'

const QuantidadeDeUsuarios = props => {
  const { quantidadeDeUsuarios } = props

  return (
    <StatsHorizontal icon={<Smile size={21} />} color='info' stats={String(quantidadeDeUsuarios)} statTitle='Quantidade de Usuários' />
  )
}

export default QuantidadeDeUsuarios
