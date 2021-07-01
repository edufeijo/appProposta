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

import config from '../../../../../../configs/statusDePropostas'

// ** Table columns
export const columns = [
  {
    name: 'id',
    selector: 'id',
    minWidth: '5px',
    cell: row => <span>{row.id}</span>
  },
  {
    name: 'Item',
    minWidth: '700px',
    selector: 'itemDaProposta',
    cell: row => {
      const name = row.nomeDoItem,
        linha1 = row.descricaoDoItem
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{name}</h6>
            <small className='text-truncate text-muted mb-0'>{linha1}</small>
          </div>
        </div>
      )
    }
  },
  {
    name: 'Preço',
    selector: 'precoDoItem',
    minWidth: '300px',
    right: true,
    cell: row => row.precoDoItem && <span>{parseFloat(row.precoDoItem.replace(",", ".")).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0})}</span>
  }
]
