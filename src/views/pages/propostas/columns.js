import { Fragment } from 'react'
import moment from 'moment'
import { corDeComoPediu } from '@utils'

import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import {
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  UncontrolledTooltip
} from 'reactstrap'
import {
  Layers,
  MoreVertical,
  Download,
  Edit,
  Trash,
  Copy,
  AlertTriangle,
  Calendar
} from 'react-feather'

import config from '../../../configs/statusDePropostas'

// ** renders client column
const renderClient = row => {
  return (
    <Fragment>
      <a href={`/cliente/preview/${row.idDoCliente}`} >
        {(row.avatar.length) ? <Avatar className='mr-50' id={`abrir-cliente-${row._id}`} img={row.avatar} width='32' height='32' /> : <Avatar color={corDeComoPediu(row.comoPediu)} id={`abrir-cliente-${row._id}`} className='mr-50' content={row.nomeDoCliente} initials />}
      </a>
      <UncontrolledTooltip placement='top' target={`abrir-cliente-${row._id}`}>
        Clique para visualizar o cliente.
      </UncontrolledTooltip>
    </Fragment>
  )
}

// ** Table columns
export const columns = [
  {
    name: 'Cliente',
    minWidth: '200px',
    selector: 'nomeDoCliente',
    sortable: true,
    cell: row => {
      const name = row.nomeDoCliente,
        linha1 = 'Local do evento',
        linha2 = 'Data do evento'
      return (
        <div className='d-flex justify-content-left align-items-center'>
          {renderClient(row)}
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{name}</h6>
            <small className='text-truncate text-muted mb-0'>{linha1}</small>
            <small className='text-truncate text-muted mb-0'>{linha2}</small>
          </div>
        </div>
      )
    }
  },
  {
    name: 'Valor',
    selector: 'valorDaProposta',
    sortable: true,
    minWidth: '60px',
    right: true,
    cell: row => row.valorDaProposta && <span>{row.valorDaProposta.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0})}</span>
  },
  {
    name: 'Proposta',
    minWidth: '10px',
    selector: 'idDaProposta',
    sortable: true,
    right: true,
    cell: row => (
      <Fragment>
        <Badge color='light-secondary' id='abrir-proposta' href={`/proposta/preview/${row._id}`}>
          <span>{`${row.idDaProposta}`}</span>
        </Badge>
        <UncontrolledTooltip placement='top' target='abrir-proposta'>
          Clique para visualizar a proposta.
        </UncontrolledTooltip>
      </Fragment>
    )
  },
  {
    name: 'Status',
    selector: 'statusDaProposta',
    sortable: true,
    minWidth: '30px',
    center: true,
    cell: row => {
      const color = config.STATUS_DE_PROPOSTAS_OPTIONS[row.statusDaProposta] && config.STATUS_DE_PROPOSTAS_OPTIONS[row.statusDaProposta].color 
      return (
        <Badge color={color} pill>
          {row.statusDaProposta}
        </Badge>
      )
    }
  }, 
  {
    name: 'Atualizada em',
    selector: 'ultimaAtualizacao',
    sortable: true,
    minWidth: '180px',
    center: true,
    cell: row => row.ultimaAtualizacao && <span>{moment(row.ultimaAtualizacao).format("DD.MM.YYYY [às] HH:mm")}</span>
  },
  {
    name: 'Informações',
    minWidth: '10px',
    selector: '',
    center: true,
    cell: row => (
      <div className='column-action d-flex align-items-center'>
        <Calendar size={17} id={`send-tooltip-${row._id}`} />
        <UncontrolledTooltip placement='top' target={`send-tooltip-${row._id}`}>
          Proposta emitida por {row.versoesDaProposta[row.versoesDaProposta.length - 1].nomeDoUsuario} e válida até {moment(row.versoesDaProposta[row.versoesDaProposta.length - 1].venceEm).format("DD.MM.YYYY [às] HH:mm")}.
        </UncontrolledTooltip>

        <Link to='#' id={`pw-tooltip-${row._id}`}>
          <Layers size={17} className='mx-1' />
        </Link>
        <UncontrolledTooltip placement='top' target={`pw-tooltip-${row._id}`}>
          {row.versoesDaProposta.length === 1 ? 'Esta proposta tem versão única.' : `Esta proposta tem ${row.versoesDaProposta.length} versões.`}
        </UncontrolledTooltip>

        <AlertTriangle size={17} id={`alert-tooltip-${row._id}`} /> 
        <UncontrolledTooltip placement='top' target={`alert-tooltip-${row._id}`}>
          <div>{row.alertaEm === null ? 'Esta proposta não tem alerta programado.' : `Um alerta está programado para ${moment(row.alertaEm).format("DD.MM.YYYY [às] HH:mm")} com a mensagem "${row.msgDoAlerta}".`}</div>
          <div>{row.versoesDaProposta[row.versoesDaProposta.length - 1].comentarioDaProposta === null ? '' : `Visualize a proposta para ler seus comentários.`}</div>
        </UncontrolledTooltip> 
      </div>
    )
  },
  {
    name: 'Ações',
    minWidth: '10px',
    selector: '',
    center: true,
    cell: row => (
      <div className='column-action d-flex align-items-center'>
        <UncontrolledDropdown>
          <DropdownToggle tag='span'>
            <MoreVertical size={17} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
{/*             <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
              <Download size={14} className='mr-50' />
              <span className='align-middle'>Download</span>
            </DropdownItem> */}
            <DropdownItem tag={Link} to={`/proposta/edit/${row._id}`} className='w-100'>
              <Edit size={14} className='mr-50' />
              <span className='align-middle'>Editar</span>
            </DropdownItem>
{/*             <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(deleteInvoice(row.id))
              }}
            >
              <Trash size={14} className='mr-50' />
              <span className='align-middle'>Delete</span>
            </DropdownItem> */}
{/*             <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
              <Copy size={14} className='mr-50' />
              <span className='align-middle'>Duplicate</span>
            </DropdownItem> */}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }
]
