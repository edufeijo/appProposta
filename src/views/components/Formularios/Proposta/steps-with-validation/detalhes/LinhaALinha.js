// ** React Imports
import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Table Columns
import { columns } from './columns'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, Card } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

import Erro from '../../../../Erro'
import { isUserLoggedIn } from '@utils'

const CustomHeader = ({ value, setValue, handleStatusValue, statusValue, handlePeriodo}) => {
  return (
    <div className='invoice-list-table-header w-100 py-2'>
      <Row>
        <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
          <div className='d-flex align-items-center mr-2'>
            <Label for='rows-per-page'>Período</Label>
            <CustomInput
              className='form-control ml-50 pr-3'
              type='select'
              id='periodo'
              onChange={handlePeriodo}
            >
              <option value='7'>últimos 7 dias</option>
              <option value='30'>últimos 30 dias</option>
              <option value='all'>Tudo</option>
            </CustomInput>
          </div>

          <Button.Ripple tag={Link} to='/proposta/new' color='primary'>
            Criar proposta
          </Button.Ripple>
        </Col>

        <Col
          lg='6'
          className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
        >
          <Input className='w-auto ' type='select' value={statusValue} onChange={handleStatusValue}>
            <option value=''>Selecione status</option>
            <option value='ativa'>ativa</option>
            <option value='aprovada'>aprovada</option>
            <option value='contratada'>contratada</option>
            <option value='vencida'>vencida</option>
            <option value='rejeitada'>rejeitada</option>
            <option value='rascunho'>rascunho</option>
          </Input>

        </Col>
      </Row>
    </div>
  )
}

const LinhaALinha = ({ proposta }) => {
  const [erro, setErro] = useState(null)
  const [data, setData] = useState([])

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)
  const [quantidadeDePropostas, setQuantidadeDePropostas] = useState()

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortCriteria, setSortCriteria] = useState({ ultimaAtualizacao: -1 }) // ordenado em ordem decrescente de atualização da proposta
  const [recarregaPagina, setRecarregaPagina] = useState(false)

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)

    if (proposta) data.push(proposta)

    } 
  }, []) 

  console.log("No LinhaALinha")

  const handleSort = (column, sortDirection) => {
    let criterioDeSort = {}
    if (sortDirection === 'asc') criterioDeSort = { [column.selector]: 1 }
    else criterioDeSort = { [column.selector]: -1 }

    setSortCriteria(criterioDeSort)
    setCurrentPage(1)
    setRecarregaPagina(!recarregaPagina)
  }

  /* function deleteTask(index) {
    const itensCopy = Array.from(data)
    itensCopy.splice(index, 1)
    setData(itensCopy)
  } */

  return (
    <div className='invoice-list-wrapper'>
      <Card>
        <div className='invoice-list-dataTable'>
          <DataTable
            noHeader
            subHeader={true}
            columns={columns}
            responsive={true}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            data={data}
            onSort={handleSort}
            sortServer
            subHeaderComponent={
              <CustomHeader
              />
            }
          />
        </div>
      </Card>
      <Erro erro={erro} />
    </div>
  )
}

export default LinhaALinha
