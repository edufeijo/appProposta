// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Table Columns
import { columns } from './columns'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

import Erro from '../../components/Erro'
import db from '../../../db'
import { isUserLoggedIn } from '@utils'
import BreadCrumbsPage from '../../components/BreadCrumbs'
import LinhasParaVisualizar from '../../components/Tabelas/LinhasParaVisualizar'
import moment from 'moment'
import { NomeDoClientePesquisado } from '../../components/AutoComplete/NomeDoClientePesquisado'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Timeline from '@components/timeline'

moment.updateLocale('en', {
  relativeTime : {
      future: "em %s",
      past:   "há %s",
      s  : 'poucos segundos',
      ss : '%d segundos',
      m:  "um minuto",
      mm: "%d minutos",
      h:  "uma hora",
      hh: "%d horas",
      d:  "um dia",
      dd: "%d dias",
      w:  "uma semana",
      ww: "%d semanas",
      M:  "um mês",
      MM: "%d meses",
      y:  "um ano",
      yy: "%d anos"
  }
})

const BotaoCriarProposta = () => {
  return (
    <Button.Ripple tag={Link} to='/proposta/new' color='primary'>
      Criar proposta
    </Button.Ripple>
  )
}

const CardSemPropostas = () => {
  return (
    <Card>
      <CardBody>
        <div align="center">
          <h4>Crie sua 1ª proposta!</h4>
          <BotaoCriarProposta/>
        </div>
      </CardBody>
    </Card>
  )
}

const CustomHeader = ({ tabelaVazia, value, setValue, handleStatusValue, statusValue, handlePeriodo}) => {
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
              value={tabelaVazia}
              onChange={handlePeriodo}
            >
              <option value='7'>últimos 7 dias</option>
              <option value='30'>últimos 30 dias</option>
              <option value='all'>Tudo</option>
            </CustomInput>
          </div>

          <BotaoCriarProposta/>
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

          <div className='w-auto ' >
            <NomeDoClientePesquisado 
              proposta={value} 
              setProposta={setValue} 
              label=''
              placeHolder='Cliente a ser pesquisado'
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const InvoiceList = () => {
  const [erro, setErro] = useState(null)

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)
  const [data, setData] = useState([])
  const [quantidadeDePropostas, setQuantidadeDePropostas] = useState()

  const [value, setValue] = useState({ nomeDoCliente: '', idDoCliente: null})
  const [currentPage, setCurrentPage] = useState(1)
  const [statusValue, setStatusValue] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortCriteria, setSortCriteria] = useState({ ultimaAtualizacao: -1 }) // ordenado em ordem decrescente de atualização da proposta
  const [periodo, setPeriodo] = useState({ $gt: moment().local().subtract(7, 'days').format() })
  const [tabelaVazia, setTabelaVazia] = useState('7')
  const [recarregaPagina, setRecarregaPagina] = useState(false)

  const propostasEmLocalStorage = JSON.parse(localStorage.getItem('@appproposta/propostas'))
  const history = useHistory()
 
  const MySwal = withReactContent(Swal)
  const AvisoDePropostaEmLocalStorage = () => {
    return MySwal.fire({
      title: `Há uma proposta pendente!`,
      text: `Quer abrir a proposta agora ou em outro momento?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Abrir',
      cancelButtonText: 'Depois',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        history.push('/proposta/review/1')
      }
    })
  }

  const handleTabelaVazia = () => {
    let periodoAumentado = periodo
    if (tabelaVazia === 'all') {
      return
    }
    if (tabelaVazia === '7') {
      periodoAumentado = { $gt: moment().local().subtract(30, 'days').format() } 
      setTabelaVazia('30')
    } else 
    if (tabelaVazia === '30') {
      periodoAumentado = {}
      setTabelaVazia('all')
    }
    setPeriodo(periodoAumentado)
    setCurrentPage(1)
    setRecarregaPagina(!recarregaPagina)
  }

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)
    } 
  }, []) 

  useEffect(() => {
    if (userDataCarregado) {
      if (propostasEmLocalStorage !== null) {
        if (propostasEmLocalStorage.empresa._id === userData.idDaEmpresa) {
          AvisoDePropostaEmLocalStorage()
        }
      }
    } 
  }, [userDataCarregado]) 

  useEffect(() => {
    if (userDataCarregado) {
      const objetoDePesquisa = { idDaEmpresa: userData.idDaEmpresa } 
      const skipPages = rowsPerPage * (currentPage - 1)
      let sortAsNumber = false
      if (sortCriteria.hasOwnProperty('idDaProposta')) sortAsNumber = true
      if (periodo.hasOwnProperty('$gt')) objetoDePesquisa.ultimaAtualizacao = periodo 
      if (statusValue.length > 0) objetoDePesquisa.statusDaProposta = statusValue
      if (value.idDoCliente !== null) objetoDePesquisa.nomeDoCliente = value.nomeDoCliente

      const query = {
        bd: "propostas",
        operador: "count",
        cardinalidade: "all",
        pesquisa: objetoDePesquisa
      } 
      db.getGenerico(query, false) 
      .then((resposta) => { 
        setQuantidadeDePropostas(resposta) 
        if (resposta === 0) handleTabelaVazia()
        else {
          const query = {
            bd: "propostas",
            operador: "sort",
            cardinalidade: rowsPerPage,
            skip: skipPages,
            pesquisa: objetoDePesquisa,
            ordenadoPor: sortCriteria, 
            sortStringAsNumber: sortAsNumber
          } 
          db.getGenerico(query, false) 
          .then((data) => { 
            data.map((proposta, index, array) => {
              proposta.versoesDaProposta = proposta.versoesDaProposta.reverse()
              proposta.expandableRowExpanded = false
            })
            setData(data) 
          })
          .catch((err) => {
            setErro(err)
            setErro(null)
          }) 
        }
      })
      .catch((err) => {
        setErro(err)
        setErro(null)
      }) 
    }
  }, [userDataCarregado, recarregaPagina]) 

  useEffect(() => {
    if (value.idDoCliente !== null || value.nomeDoCliente.length === 0) {
      setCurrentPage(1)
      setRecarregaPagina(!recarregaPagina)
    } 
  }, [value]) 

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
    setCurrentPage(1)
    setRecarregaPagina(!recarregaPagina)
  }

  const handleSort = (column, sortDirection) => {
    let criterioDeSort = {}
    if (sortDirection === 'asc') criterioDeSort = { [column.selector]: 1 }
    else criterioDeSort = { [column.selector]: -1 }

    setSortCriteria(criterioDeSort)
    setCurrentPage(1)
    setRecarregaPagina(!recarregaPagina)
  }

  const handlePeriodo = e => {
    const dias = e.target.value

    let periodo = {}
    if (dias === '7') {
      periodo = { $gt: moment().local().subtract(7, 'days').format() } 
      setTabelaVazia('7')
    } else
    if (dias === '30') {
      periodo = { $gt: moment().local().subtract(30, 'days').format() } 
      setTabelaVazia('30')
    } else setTabelaVazia('all')

    setPeriodo(periodo)
    setCurrentPage(1)
    setRecarregaPagina(!recarregaPagina)
  }

  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
    setRecarregaPagina(!recarregaPagina)
  }

  const CustomPagination = () => {
    const count = Math.ceil(quantidadeDePropostas / rowsPerPage) // arredonda para cima e devolve inteiro
    return (
      <ReactPaginate
        pageCount={count || 1}
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        activeClassName='active'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
    )
  }

  const formataVersoesDaProposta = (data) => {
    const versoesDaProposta = data.versoesDaProposta.map((versao, index, array) => {
      const content = `${moment(versao.dataDaVersaoDaProposta).format("DD.MM.YYYY [às] HH:mm")} por ${versao.nomeDoUsuario} com status "${versao.statusDaVersaoDaProposta}" e vencimento em ${moment(versao.venceEm).format("DD.MM.YYYY [às] HH:mm")}`
      const precoTotal =  versao.itensDaVersaoDaProposta ? versao.itensDaVersaoDaProposta.reduce((total, item) => total + item.precoDoItem, 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0}) : 0
      const quantidadeDeItens = versao.itensDaVersaoDaProposta && versao.itensDaVersaoDaProposta.length
      const itens = quantidadeDeItens === 1 ? '1 item' : `${quantidadeDeItens} itens`

      versao.color = 'primary'
      versao.title = `Valor da proposta (${itens}): ${precoTotal}`

      if (index + 1 === data.versoesDaProposta.length) versao.content = `Criada em ${content}`
      else versao.content = `Atualizada em ${content}`

      versao.meta = `${moment(versao.dataDaVersaoDaProposta).fromNow()}`

      versao.customContent = (
        <Fragment>
          <div className='demo-inline-spacing'>
            <Button.Ripple color='primary' outline>Visualizar</Button.Ripple>
            <Button.Ripple color='primary' outline>Editar</Button.Ripple>
            {versao.arquivoDaProposta !== null &&  <Button.Ripple color='primary' outline>Baixar arquivo</Button.Ripple>}
          </div>
        </Fragment>
      )
      return versao
    })   
    return versoesDaProposta
  }

  const ExpandableTable = ({ data }) => {
    return (
      <div className='expandable-content p-2'>
        <Card>
          <CardHeader>
            <CardTitle tag='h4'>Histórico da proposta 
              <Badge color='light-secondary'>
                <span>{`${data.idDaProposta}`}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Col lg='12'>
              <Timeline data={formataVersoesDaProposta(data)} />
            </Col>
          </CardBody>
        </Card>
      </div>
    )
  }

  const onRowExpandToggled = (toggleState, row) => {
    const dataCopy = Array.from(data)
    dataCopy.map((proposta, index, array) => {
      proposta.expandableRowExpanded = false
    })
    dataCopy[dataCopy.findIndex(element => element._id === row._id)].expandableRowExpanded = toggleState
    setData(dataCopy)
  }

  return (
    <div className='invoice-list-wrapper'>
      <BreadCrumbsPage breadCrumbTitle='Propostas' breadCrumbParent={`Visualizar ${quantidadeDePropostas} proposta${(quantidadeDePropostas !== 1) ? 's' : ''}`}/>
      {!data.length && <CardSemPropostas />}
      {data.length && <Card>
        <div className='invoice-list-dataTable'>
          <DataTable
            noHeader
            pagination
            paginationServer
            subHeader={true}
            columns={columns}
            responsive={true}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationDefaultPage={currentPage}
            paginationComponent={CustomPagination}
            data={data}
            onSort={handleSort}
            sortServer
            expandableRows
            expandableRowsHideExpander
            expandOnRowClicked
            onRowExpandToggled={onRowExpandToggled}
            expandableRowExpanded={row => row.expandableRowExpanded}
            expandableRowsComponent={<ExpandableTable keyField='_id' />}
            subHeaderComponent={
              <CustomHeader
                tabelaVazia={tabelaVazia}
                value={value}
                setValue={setValue}
                statusValue={statusValue}
                handleStatusValue={handleStatusValue}
                handlePeriodo={handlePeriodo}
              />
            }
          />
        </div>
        <LinhasParaVisualizar 
          rowsPerPage={rowsPerPage} 
          setRowsPerPage={setRowsPerPage} 
          setCurrentPage={setCurrentPage} 
          setRecarregaPagina={setRecarregaPagina} 
          recarregaPagina={recarregaPagina} 
        />
      </Card>}
      <Erro erro={erro} />
    </div>
  )
}

export default InvoiceList
