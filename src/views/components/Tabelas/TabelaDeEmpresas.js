import { MoreVertical, Edit, Trash } from 'react-feather'
import moment from 'moment'
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const TabelaDeEmpresas = props => {
  const { empresas } = props
/*   console.log("empresas=", empresas) */

  return (
    <Table hover size="sm" responsive>
      <thead>
        <tr>
{/*           <th>id</th> */}
          <th>logo</th>
          <th>empresa</th>
{/*           <th>email</th> */}
          <th>registro em</th>
{/*           <th>usuários</th> */}
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {empresas.map((empresa) => {
          return (
            <tr key={empresa._id}>
              <td>
{/*                   <img className='mr-75' src={logoteste1} alt='angular' height='20' width='20' /> */}
{/*                   <span className='align-middle font-weight-bold'>{empresa.id}</span> */}
                </td>
                <td>{empresa.nomeDaEmpresa}</td>
{/*                 <td>{empresa.usuarios[0].emailDoUsuario}</td> */}
                <td>{moment(empresa.dataDeRegistroDaEmpresa).format("DD.MM.YYYY HH:mm:ss")}</td> 
{/*                 <td>{empresa.usuarios.length}</td>  */}
                <td>
                  <Badge pill color='light-primary' className='mr-1'>
                    {empresa.statusDaEmpresa}
                  </Badge>
                </td>
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

export default TabelaDeEmpresas