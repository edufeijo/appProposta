import { MoreVertical, Edit, Trash } from 'react-feather'
import moment from 'moment'
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const TabelaDeUsuarios = props => {
  const { usuarios } = props
/*   console.log("empresas=", empresas) */

  return (
    <Table hover size="sm" responsive>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Registro em</th>
          <th>Email</th> 
          <th>Senha</th> 
          <th>Criador</th> 
          <th>Empresa</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => {
          return (
            <tr key={usuario._id}>
              <td>{usuario.nomeDoUsuario} {usuario.sobrenomeDoUsuario}</td>
              <td>{moment(usuario.dataDeRegistroDoUsuario).format("DD.MM.YYYY HH:mm:ss")}</td> 
              <td>{usuario.emailDoUsuario}</td> 
              <td>{usuario.senhaDoUsuario}</td> 
              <td>{usuario.criadorDaEmpresa ? 'SIM' : 'NÃO'}</td> 
              <td>{usuario.nomeDaEmpresa}</td> 
              <td>
                  <Badge pill color='light-primary' className='mr-1'>
                  {usuario.statusDoUsuario}
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

export default TabelaDeUsuarios