import { Fragment } from 'react'
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
  Eye,
  Info
} from 'react-feather'

import config from '../../../configs/statusDaTabelaDePrecos'

// ** Table columns
export const columns = [
  {
    name: 'Setor',
    minWidth: '150px',
    selector: 'setor',
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <h6 className='user-name text-truncate mb-0'>{row.setor}</h6>
        </div>
      )
    }
  },
  {
    name: 'Segmento',
    minWidth: '150px',
    selector: 'segmento',
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <h6 className='user-name text-truncate mb-0'>{row.segmento}</h6>
        </div>
      )
    }
  },
  {
    name: 'Serviço',
    minWidth: '150px',
    selector: 'servico',
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <h6 className='user-name text-truncate mb-0'>{row.servico}</h6>
        </div>
      )
    }
  },
  {
    name: 'Status',
    selector: 'statusDaTabelaDePrecos',
    sortable: true,
    minWidth: '30px',
    center: true,
    cell: row => {
      const color = config.STATUS_DA_TABELA_DE_PRECOS_OPTIONS[row.statusDaTabelaDePrecos] && config.STATUS_DA_TABELA_DE_PRECOS_OPTIONS[row.statusDaTabelaDePrecos].color 
      return (
        <Badge color={color} pill>
          {row.statusDaTabelaDePrecos}
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
          Tabela de preços atualizada por {row.versoesDaTabelaDePrecos[0].nomeDoUsuario} em {moment(row.versoesDaTabelaDePrecos[0].dataDaVersaoDaTabelaDePrecos).format("DD.MM.YYYY [às] HH:mm")}.
        </UncontrolledTooltip>

        <Link to='#' id={`pw-tooltip-${row._id}`}>
          <Layers size={17} className='mx-1' />
        </Link>
        <UncontrolledTooltip placement='top' target={`pw-tooltip-${row._id}`}>
          {row.versoesDaTabelaDePrecos.length === 1 ? 'Esta tabela de preços tem versão única.' : `Esta tabela de preços tem ${row.versoesDaTabelaDePrecos.length} versões.`}
        </UncontrolledTooltip>

{/*         <Link to='#' id={`pw-dadosInformativosObrigatorios-${row._id}`}>
          <Info size={17} className='mx-1' />
        </Link>
        <UncontrolledTooltip placement='top' target={`pw-dadosInformativosObrigatorios-${row._id}`}>
          {row.versoesDaTabelaDePrecos[0].dadosInformativosObrigatorios.length === 1 ? 'Esta tabela de preços 1 dado informativo.' : `Esta tabela de preços tem ${row.versoesDaTabelaDePrecos[0].dadosInformativosObrigatorios.length} dados informativos.`}
        </UncontrolledTooltip> */}

        <Info size={17} id={`alert-dadosInformativosObrigatorios-${row._id}`} /> 
        <UncontrolledTooltip placement='top' target={`alert-dadosInformativosObrigatorios-${row._id}`}>
          {row.versoesDaTabelaDePrecos[0].dadosInformativosObrigatorios.length === 1 ? 'Esta tabela de preços 1 dado informativo.' : `Esta tabela de preços tem ${row.versoesDaTabelaDePrecos[0].dadosInformativosObrigatorios.length} dados informativos.`}
        </UncontrolledTooltip> 
      </div>
    )
  },
  {
    name: 'Ações',
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
              {<DropdownItem tag={Link} to={`/precos/edit/${row._id}`} className='w-100'>
                <Eye size={14} className='mr-50' />
                <span className='align-middle'>Visualizar</span>
              </DropdownItem>}
              <DropdownItem tag={Link} to={`/precos/edit/${row._id}`} className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Editar</span>
              </DropdownItem>            
              {<DropdownItem tag={Link} to={`/precos/edit/${row._id}`} className='w-100'>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Duplicar</span>
              </DropdownItem>}
{/*               {row.propostaCriadaPor !==  "Documento externo" && <DropdownItem className='w-100' onClick={() => tratarPDF(row, 0)}>
                <Download size={14} className='mr-50' />
                <span className='align-middle'>Gerar PDF</span>
              </DropdownItem>}
              {row.propostaCriadaPor ===  "Documento externo" && <DropdownItem className='w-100' onClick={() => console.log("Baixar documento")}>
                <Download size={14} className='mr-50' />
                <span className='align-middle'>Baixar documento</span>
              </DropdownItem>} */}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  } 
]
