import StatsHorizontal from '@components/widgets/stats/StatsVertical'
import { Users } from 'react-feather'

const QuantidadeDeClientes = props => {
  const { quantidadeDeClientes } = props

  return (
    <StatsHorizontal icon={<Users size={21} />} color='info' stats={String(quantidadeDeClientes)} statTitle='Quantidade de Clientes' />
  )
}

export default QuantidadeDeClientes
