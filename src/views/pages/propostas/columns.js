import { Fragment, useState } from 'react'
import moment from 'moment'
import db from '../../../db'
import { corDeComoPediu, geraPDF } from '@utils'

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
  Copy,
  AlertTriangle,
  Calendar,
  Eye
} from 'react-feather'

import config from '../../../configs/statusDePropostas'

const tratarPDF = (proposta, versao) => {
  const query = {
    bd: "templates",
    operador: "get",
    cardinalidade: "one",
    pesquisa: { 
      idDaEmpresa: proposta.idDaEmpresa
    }
  } 
  db.getGenerico(query, false) 
  .then((templates) => { 
    let template = null
    let logo = null
    if (templates) {
      if (proposta.versoesDaProposta[versao].hasOwnProperty('versaoDoTemplate')) template = templates.versoesDoTemplate[proposta.versoesDaProposta[versao].versaoDoTemplate]
      logo = templates.logo
    }
    geraPDF(proposta, template, logo)
  })
  .catch((err) => {
  }) 
}

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
    cell: row => row.ultimaAtualizacao && <span>{moment(row.ultimaAtualizacao).format("DD.MM.YYYY [??s] HH:mm")}</span>
  },
  {
    name: 'Informa????es',
    minWidth: '10px',
    selector: '',
    center: true,
    cell: row => (
      <div className='column-action d-flex align-items-center'>
        <Calendar size={17} id={`send-tooltip-${row._id}`} />
        <UncontrolledTooltip placement='top' target={`send-tooltip-${row._id}`}>
          Proposta emitida por {row.versoesDaProposta[0].nomeDoUsuario} e v??lida at?? {moment(row.versoesDaProposta[0].venceEm).format("DD.MM.YYYY [??s] HH:mm")}.
        </UncontrolledTooltip>

        <Link to='#' id={`pw-tooltip-${row._id}`}>
          <Layers size={17} className='mx-1' />
        </Link>
        <UncontrolledTooltip placement='top' target={`pw-tooltip-${row._id}`}>
          {row.versoesDaProposta.length === 1 ? 'Esta proposta tem vers??o ??nica.' : `Esta proposta tem ${row.versoesDaProposta.length} vers??es.`}
        </UncontrolledTooltip>

        <AlertTriangle size={17} id={`alert-tooltip-${row._id}`} /> 
        <UncontrolledTooltip placement='top' target={`alert-tooltip-${row._id}`}>
          <div>{row.alertaEm === null ? 'Esta proposta n??o tem alerta programado.' : `Um alerta est?? programado para ${moment(row.alertaEm).format("DD.MM.YYYY [??s] HH:mm")} com a mensagem "${row.msgDoAlerta}".`}</div>
          <div>{row.comentarioDaProposta === null ? '' : `Visualize a proposta para ler seus coment??rios.`}</div>
        </UncontrolledTooltip> 
      </div>
    )
  },
  {
    name: 'A????es',
    minWidth: '10px',
    selector: '',
    center: true,
    cell: row => {
      return (
        <div className='column-action d-flex align-items-center'>
          <UncontrolledDropdown>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu right>
              {row.propostaCriadaPor !==  "Documento externo" && <DropdownItem tag={Link} to={`/proposta/edit/${row._id}`} className='w-100'>
                <Eye size={14} className='mr-50' />
                <span className='align-middle'>Visualizar</span>
              </DropdownItem>}
              <DropdownItem tag={Link} to={`/proposta/edit/${row._id}`} className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Editar</span>
              </DropdownItem>            
              {row.propostaCriadaPor !==  "Documento externo" && <DropdownItem tag={Link} to={`/proposta/edit/${row._id}`} className='w-100'>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Duplicar</span>
              </DropdownItem>}
              {row.propostaCriadaPor !==  "Documento externo" && <DropdownItem className='w-100' onClick={() => tratarPDF(row, 0)}>
                <Download size={14} className='mr-50' />
                <span className='align-middle'>Gerar PDF</span>
              </DropdownItem>}
              {row.propostaCriadaPor ===  "Documento externo" && <DropdownItem className='w-100' onClick={() => console.log("Baixar documento")}>
                <Download size={14} className='mr-50' />
                <span className='align-middle'>Baixar documento</span>
              </DropdownItem>}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]
