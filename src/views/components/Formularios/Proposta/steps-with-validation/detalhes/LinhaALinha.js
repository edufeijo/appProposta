import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { columns } from './columns'
import { ChevronDown, ArrowLeft, ArrowRight, Upload, Plus, Save } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, FormFeedback, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Erro from '../../../../Erro'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM, QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM } from '../../../../../../configs/appProposta'
import { isObjEmpty } from '@utils'

const NomeDoNovoItem = ({ item, setItem, errors, register }) => {
  const handleChange = e => {
    const { name, value } = e.target
    setItem(registroAnterior => ({
      ...registroAnterior, 
      nomeDoItem: value
    }))
  }

  return (
    <div>
      <Label className='form-label' for='nomeDoItem'>
        Nome do item
      </Label>
      <Input
        name='nomeDoItem'
        id='nomeDoItem'
        placeholder='Nome do item'
        defaultValue={item.nomeDoItem}
        autoComplete="off"
        innerRef={register({ required: true })}
        invalid={errors.nomeDoItem && true}
        onChange={handleChange}
      />
      {errors && errors.nomeDoItem && <FormFeedback>Nome do item com no mínimo {QTDADE_MIN_LETRAS_NOME_DO_ITEM} e no máximo {QTDADE_MAX_LETRAS_NOME_DO_ITEM} caracteres</FormFeedback>}
    </div>
  ) 
}

const PrecoDoNovoItem = ({ item, setItem, errors, register }) => {
  const handleChange = e => {
    const { name, value } = e.target
    setItem(registroAnterior => ({
      ...registroAnterior, 
      precoDoItem: value
    }))  
  }

  return (
    <div>
      <Label className='form-label' for='precoDoItem'>
        Preço do item
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <Input
          name='precoDoItem'
          id='precoDoItem'
          placeholder={"1000,00"}
          defaultValue={item.precoDoItem}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors.precoDoItem && true}
          onChange={handleChange}
        />
        {errors && errors.precoDoItem && <FormFeedback>Exemplos: 1244 ou 283,15</FormFeedback>}
      </InputGroup>
      </div>
  )
}

const DescricaoDoNovoItem = ({ item, setItem, errors, register }) => {
  const handleChange = e => {
    const { name, value } = e.target
    setItem(registroAnterior => ({
      ...registroAnterior, 
      descricaoDoItem: value
    }))
  }

  return (
    <div>
      <Label className='form-label' for='descricaoDoItem'>
        Descrição do item
      </Label>
      <InputGroup className='input-group-merge'>
        <Input 
          name='descricaoDoItem'
          id='descricaoDoItem'
          defaultValue={item.descricaoDoItem}
          innerRef={register({ required: true })}
          invalid={errors.descricaoDoItem && true}
          onChange={handleChange}
          type='textarea' 
          placeholder='Descrição do item'
        />
        {errors && errors.descricaoDoItem && <FormFeedback>Máximo de {QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM} caracteres</FormFeedback>}
      </InputGroup>
    </div>
  ) 
}

const CustomHeader = ({ value, setValue, handleStatusValue, statusValue, handlePeriodo}) => {
  return (
    <div className='invoice-list-table-header w-100 py-2'>
{/*       <Row>
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
      </Row> */}
    </div>
  )
}

const LinhaALinha = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao, stepper, type }) => {
  const [erro, setErro] = useState(null)

  const valoresIniciaisItem = { 
    id: 0,
    nomeDoItem: '', 
    precoDoItem: null, 
    descricaoDoItem: '' 
  }

  const [item, setItem] = useState(valoresIniciaisItem)
  const [tabelaDeItens, setTabelaDeItens] = useState([])

  const [userDataCarregado, setUserDataCarregado] = useState(false)
  const [quantidadeDePropostas, setQuantidadeDePropostas] = useState()

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortCriteria, setSortCriteria] = useState({ ultimaAtualizacao: -1 }) // ordenado em ordem decrescente de atualização da proposta
  const [recarregaPagina, setRecarregaPagina] = useState(false)

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
  
  const SignupSchema = yup.object().shape({
    nomeDoItem: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_ITEM).max(QTDADE_MAX_LETRAS_NOME_DO_ITEM).required(),
    precoDoItem: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required(),
    descricaoDoItem: yup.string().max(QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM)
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = () => {
    trigger()    
    console.log("===================== No onSubmit")
    console.log("errors=", errors)

    if (isObjEmpty(errors)) {
      console.log("Não há erros")
      if (tabelaDeItens.length) item.id = tabelaDeItens[tabelaDeItens.length - 1].id + 1
      else item.id = 1
      tabelaDeItens.push(item)
      setItem(valoresIniciaisItem)
    } else console.log("===================== Tem erros")
  }

  console.log("======================= No LinhaALinha")
  console.log("item=", item)
  console.log("tabelaDeItens=", tabelaDeItens)
  console.log("errors=", errors)

  return (
    <Fragment>
      {tabelaDeItens.length > 0 && <div className='invoice-list-wrapper'> 
        <div className='invoice-list-dataTable'>
          <DataTable
            noHeader
            subHeader={true}
            columns={columns}
            responsive={true}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            data={tabelaDeItens}
            onSort={handleSort}
            sortServer
            subHeaderComponent={
              <CustomHeader
              />
            }
          />
        </div>
      </div>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='invoice-preview-wrapper'>
          <Row className='invoice-preview'>
            <Col xl={9} md={8} sm={12}>
              <NomeDoNovoItem 
                item={item}
                setItem={setItem}
                errors={errors}
                register={register}
              />
              <DescricaoDoNovoItem 
                item={item}
                setItem={setItem}
                errors={errors}
                register={register}
              />
              <PrecoDoNovoItem 
                item={item}
                setItem={setItem}
                errors={errors}
                register={register}
              />
            </Col>

            <Col xl={3} md={4} sm={12}>
              <Label className='form-label' for='nomeDoItem'>
                Ações:
              </Label>
              <Button.Ripple 
                color='primary' 
                block 
                className='mb-75'
                type='submit' 
              >
                <span>Incluir item</span>
                <Plus size={14} className='align-middle ml-sm-25 ml-0'></Plus>
              </Button.Ripple>
              <Button.Ripple color='secondary' block outline className='mb-75'>
                <span>Guardar rascunho</span>
                <Save size={14} className='align-middle ml-sm-25 ml-0'></Save>
              </Button.Ripple>
              <Label className='form-label' for='nomeDoItem'>
                Proposta gerada em outro sistema:
              </Label>
              <Button.Ripple 
                color='secondary' 
                block 
                outline 
                className='mb-75'
                onClick={() => setProposta(registroAnterior => ({...registroAnterior, propostaCriadaPor: 'Documento externo'}))}
              >
                <span>Carregar proposta</span>
                <Upload size={14} className='align-middle ml-sm-25 ml-0'></Upload>
              </Button.Ripple>
            </Col>
          </Row>
        </div>

        <div className='d-flex justify-content-between'>
          <Button.Ripple 
            color='primary' 
            className='btn-prev' 
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button.Ripple>
          <Button.Ripple 
            color='primary' 
            className='btn-next'
          >
            <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>

      <Erro erro={erro} />
    </Fragment>
  )
}

export default LinhaALinha
