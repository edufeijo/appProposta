import { MoreVertical, Edit, Trash } from 'react-feather'
import moment from 'moment'
import { Table, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const TabelaDeClientes = props => {
  const { clientes } = props

  return (
    <Table hover size="sm" responsive>
      {(clientes.length > 0) &&
        <thead>
        <tr>
          <th>id</th>
          <th>nome Do Cliente</th>
          <th>idDaEmpresa</th>
          <th>Ações</th>
        </tr>
      </thead>}
      <tbody>
        {clientes.map((cliente) => {
          return (
            <tr key={cliente._id}>
              <td>{cliente._id}</td>
              <td>{cliente.nomeDoCliente}</td>
              <td>{cliente.idDaEmpresa}</td>
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

export default TabelaDeClientes