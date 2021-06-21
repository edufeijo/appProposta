import { MoreVertical, Edit, Trash } from 'react-feather'
import moment from 'moment'
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const TabelaDePropostas = props => {
  const { propostas } = props

  return (
    <Table hover size="sm" responsive>
      {(propostas.length > 0) &&
        <thead>
        <tr>
          <th>id</th>
          <th>nome Do Cliente</th>
          <th>Ações</th>
        </tr>
      </thead>}
      <tbody>
        {propostas.map((proposta) => {
          return (
            <tr key={proposta._id}>
              <td>{proposta.idDaProposta}</td>
              <td>{proposta.nomeDoCliente}</td>
              <td>
                <UncontrolledDropdown>
                  <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                    <MoreVertical size={15} />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href='/' onClick={e => e.preventDefault()}>
                      <Edit className='mr-50' size={15} /> <span className='align-middle'>Editar</span>
                    </DropdownItem>
                    <DropdownItem href='/' onClick={e => e.preventDefault()}>
                      <Trash className='mr-50' size={15} /> <span className='align-middle'>Excluir</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default TabelaDePropostas