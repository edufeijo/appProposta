import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Box, Calendar, Check, Copy, DollarSign, Edit, Eye, Facebook, Instagram, List, MoreVertical, Plus, PlusCircle, Settings, Twitch, Twitter } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Badge, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup, UncontrolledDropdown, DropdownToggle, CustomInput, Label, InputGroup, InputGroupAddon, InputGroupText, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, DropdownMenu, DropdownItem, FormFeedback } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM, QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, QTDADE_MIN_LETRAS_NOME_DA_VARIAVEL, QTDADE_MAX_LETRAS_NOME_DA_VARIAVEL } from '../../../../../configs/appProposta'

const erroQuantidadeDeCaracteres = (campo, min, max) => {
  /*  retorna:
      0 se campo está correto
      1 se campo é null e não precisa mostrar msg de erro
      2 se campo não está preenchido corretamente  
  */
  if (campo === null) return 1
  else if (campo.length < min || campo.length > max) return 2
  else return 0
}

const VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS = { 
  id: 0,
  nomeDoItem: null,
  itemHabilitado: true,
  itemObrigatorioNaProposta: false,
  itemAbertoNoFormulario: true,
  erroNoItem: {
    nomeDoItem: true
  } 
}

const VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM = {
  id: 1,
  nomeDoComponente: 'Componente 1',
  tipoDoComponente: 'Valor fixo',
  valorFixoDoComponente: null,
  erroNoComponente: {
    valorFixoDoComponente: true
  } 
}

const tipoDoComponenteOptions = [
  { name: 'tipoDoComponente', value: 'Valor fixo', label: 'Valor fixo' },
  { name: 'tipoDoComponente', value: 'Variável x valor fixo', label: 'Variável x valor fixo' },
  { name: 'tipoDoComponente', value: 'Tabela', label: 'Tabela' }
]

const tipoDaVariavelOptions = [
  { name: 'tipoDaVariavel', value: 'NUMERO', label: 'Número' },
  { name: 'tipoDaVariavel', value: 'SIMNAO', label: 'Sim ou não' },
  { name: 'tipoDaVariavel', value: 'SELECAO', label: 'Seleção' },
  { name: 'tipoDaVariavel', value: 'ALFANUMERICA', label: 'Alfanumérica' },
  { name: 'tipoDaVariavel', value: 'DATA', label: 'Data' },
  { name: 'tipoDaVariavel', value: 'TABELA', label: 'Tabela' }
]

const VALORES_INICIAIS_DA_VARIAVEL_NUMERO = {
  tipoDaVariavel: 'NUMERO',
  valorMinimo: null,
  valorMaximo: null,
  permitidoAlterar: {
    tipoDaVariavel: true,
    valorMinimo: true,
    valorMaximo: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL_SIM_OU_NAO = {
  tipoDaVariavel: 'SIMNAO',
  permitidoAlterar: {
    tipoDaVariavel: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL_SELECAO = {
  tipoDaVariavel: 'SELECAO',
  opções: [],
  permitidoAlterar: {
    tipoDaVariavel: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL_ALFANUMERICA = {
  tipoDaVariavel: 'ALFANUMERICA',
  permitidoAlterar: {
    tipoDaVariavel: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL_DATA = {
  tipoDaVariavel: 'DATA',
  permitidoAlterar: {
    tipoDaVariavel: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL_TABELA = {
  tipoDaVariavel: 'TABELA',
  permitidoAlterar: {
    tipoDaVariavel: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL = {
  variavelHabilitada: true, // não pode desabilitar uma variável que entra em cálculos
  variavelObrigatoria: false,
  permitidoAlterar: {
    name: true,
    value: true,
    label: true,
    variavelHabilitada: true,
    variavelObrigatoria: true
  },
  conteudo: VALORES_INICIAIS_DA_VARIAVEL_NUMERO
}

const variavelComErro = (item) => {  
  if (isObjEmpty(item.erroNaVariavel)) return false
  else return true
}  

const HeaderDaVariavel = ({ item, index, countVariaveis, setCountVariaveis, variaveis, setVariaveis, variavelAberta, setVariavelAberta, atualizaFormulario, setAtualizaFormulario }) => {     
  const criaVariavelNoFormulario = () => { 
    const item = VALORES_INICIAIS_DA_VARIAVEL
    let id = 0
    if (variaveis.length === 1) id = variaveis[0].id + 1
    else {
      const numbers = Array.from(variaveis) 
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    item.name = `Variável ${id}`
    item.value = `Variável ${id}`
    item.label = `Variável ${id}`
    item.erroNaVariavel = {} 
    variaveis.push(Object.assign({}, item))
    setCountVariaveis(countVariaveis + 1)
  }

/*   const excluiVariavelNoFormulario = (i) => {
    if (variaveis[i].permitidoAlterar.variavelExcluida) {
      const itensCopy = Array.from(variaveis)
      itensCopy[i].variavelHabilitada = false
      itensCopy[i].variavelObrigatoria = false
      itensCopy[i].variavelAbertaNoFormulario = false
      itensCopy[i].erroNaVariavel = {} 
      setVariaveis(itensCopy)  
    }
  }   */

  const corDoNomeDaVariavel = (item) => {    
    if (variavelComErro(item)) return 'light-danger'
    else {
      if (item.variavelHabilitada) return 'primary'
      else return 'light-secondary'
    }  
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={corDoNomeDaVariavel(item)} pill onClick={() => setVariavelAberta(!variavelAberta)}>
          {item.label}
        </Badge>
        <div className='column-action d-flex align-items-center'> 
          <UncontrolledDropdown>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaVariavelNoFormulario()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar variável</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar variável</span>
              </DropdownItem>                      
{/*               {item.permitidoAlterar.variavelExcluida && <DropdownItem className='w-100' onClick={() => excluiVariavelNoFormulario(index)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir variável</span>
              </DropdownItem>}    */}     
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const NomeDaVariavel = ({ index, variaveis, setVariaveis }) => {
  const SignupSchema = yup.object().shape({ 
    [`nomeDaVariavel${index}`]: yup.string().min(QTDADE_MIN_LETRAS_NOME_DA_VARIAVEL).max(QTDADE_MAX_LETRAS_NOME_DA_VARIAVEL).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  }) 

  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(variaveis)
    if (temporaryarray[index].permitidoAlterar.label) temporaryarray[index].label = value
    if (temporaryarray[index].permitidoAlterar.value) temporaryarray[index].value = value
    if (temporaryarray[index].permitidoAlterar.name) temporaryarray[index].name = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNaVariavel.label
    else temporaryarray[index].erroNaVariavel.label = true   
 
    setVariaveis(temporaryarray)
  }

  const defaultValue = variaveis[index].label

  return (
    <div>
      <p></p>
      <Label className='form-label' for={`nomeDaVariavel${index}`}>
        Nome da variável
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <Input
          name={`nomeDaVariavel${index}`}
          id={`nomeDaVariavel${index}`}
          placeholder='Nome da variável'
          defaultValue={defaultValue}
          autoComplete="off"
          onChange={handleChange}
          disabled={!variaveis[index].permitidoAlterar.label}
          innerRef={register({ required: true })}
          invalid={errors[`nomeDaVariavel${index}`] && true} 
        />
       {errors && errors[`nomeDaVariavel${index}`] && <FormFeedback>Use entre {QTDADE_MIN_LETRAS_NOME_DA_VARIAVEL} e {QTDADE_MAX_LETRAS_NOME_DA_VARIAVEL} caracteres</FormFeedback>} 
      </InputGroup>
    </div>
  ) 
}

const TipoDaVariavel = ({ index, variaveis, setVariaveis }) => {
  const setTipoDaVariavel = (tipoDaVariavel, index) => { 
    const temporaryarray = Array.from(variaveis)

    console.log("-----------------------------------=")
    console.log("tipoDaVariavel=", tipoDaVariavel)
    
    if (tipoDaVariavel === 'NUMERO') temporaryarray[index].conteudo = VALORES_INICIAIS_DA_VARIAVEL_NUMERO
    else 
    if (tipoDaVariavel === 'SIMNAO') temporaryarray[index].conteudo = VALORES_INICIAIS_DA_VARIAVEL_SIM_OU_NAO
    else 
    if (tipoDaVariavel === 'SELECAO') temporaryarray[index].conteudo = VALORES_INICIAIS_DA_VARIAVEL_SELECAO
    else 
    if (tipoDaVariavel === 'ALFANUMERICA') temporaryarray[index].conteudo = VALORES_INICIAIS_DA_VARIAVEL_ALFANUMERICA
    else 
    if (tipoDaVariavel === 'DATA') temporaryarray[index].conteudo = VALORES_INICIAIS_DA_VARIAVEL_DATA
    else 
    if (tipoDaVariavel === 'TABELA') temporaryarray[index].conteudo = VALORES_INICIAIS_DA_VARIAVEL_TABELA

    setVariaveis(temporaryarray)
  }

  const handleChangeCheckbox = (flag) => { 
    if (variaveis[index].permitidoAlterar[flag]) {
      const temporaryarray = Array.from(variaveis)
      temporaryarray[index][flag] = !temporaryarray[index][flag] 
      setVariaveis(temporaryarray)
    }
  }

  /*   variavelHabilitada: true, // não pode desabilitar uma variável que entra em cálculos
  variavelObrigatoria: true, // não pode desobrigar uma variável que entra em cálculos */

  return ( 
    <Fragment>
      <Row>
        <FormGroup tag={Col} md='6' sd='12'>
          <Label>Tipo da variável:</Label>
          <Select
            id={`tipoDaVariavel${index}`}               
            theme={selectThemeColors}
            maxMenuHeight={240}
            className='react-select'
            classNamePrefix='select'
            value={tipoDaVariavelOptions[tipoDaVariavelOptions.findIndex(element => element.value === variaveis[index].conteudo.tipoDaVariavel)]}
            options={tipoDaVariavelOptions}
            onChange={e => { setTipoDaVariavel(e.value, index) }}
            isClearable={false}
            isDisabled={!variaveis[index].conteudo.permitidoAlterar.tipoDaVariavel}
          />
        </FormGroup>
        <FormGroup tag={Col} md='3' sd='6'>
          <CustomInput
            name={`variavelHabilitada${index}`}
            id={`variavelHabilitada${index}`}
            type='checkbox'
            className='custom-control-success'
            label='Variável habilitada'
            defaultChecked={variaveis[index].variavelHabilitada}
            inline
            disabled={!variaveis[index].permitidoAlterar.variavelHabilitada}
            onChange={e => { handleChangeCheckbox('variavelHabilitada') }}
          />
        </FormGroup> 
        <FormGroup tag={Col} md='3' sd='6'>
          <CustomInput
            name={`variavelObrigatoria${index}`}
            id={`variavelObrigatoria${index}`}
            type='checkbox'
            className='custom-control-success'
            label='Variável obrigatória'
            defaultChecked={variaveis[index].variavelObrigatoria}
            inline
            disabled={!variaveis[index].permitidoAlterar.variavelObrigatoria}
            onChange={e => { handleChangeCheckbox('variavelObrigatoria') }}
          />
        </FormGroup>
      </Row>
    </Fragment>
  )
}

const InputNumero = ({ index, atualizaValor, labelDoNumero, propriedadeDoNumero, variaveis, setVariaveis }) => { 
  const SignupSchema = yup.object().shape({
    [`inputNumero${labelDoNumero}${index}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^-?\d*,?\d+$/).required() 
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const defaultValue = variaveis[index].conteudo[propriedadeDoNumero]

  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(variaveis)
    temporaryarray[index].conteudo[propriedadeDoNumero] = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNaVariavel.errors
    else temporaryarray[index].erroNaVariavel = errors   
  
    setVariaveis(temporaryarray)
  }

  return (
    <div key={atualizaValor}>
      <Label className='form-label' for={`inputNumero${labelDoNumero}${index}`}>
        {labelDoNumero}
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <Input
          name={`inputNumero${labelDoNumero}${index}`}
          id={`inputNumero${labelDoNumero}${index}`}
          placeholder={`${labelDoNumero}`}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`inputNumero${labelDoNumero}${index}`] && true}
          onChange={handleChange}
        />
        {errors && errors[`inputNumero${labelDoNumero}${index}`] && <FormFeedback>Máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } caracteres (incluindo números, vírgula e sinal de menos)</FormFeedback>}
      </InputGroup>
    </div>
  )
}

const ConfiguraNumero = ({ index, variaveis, setVariaveis }) => {
  const [atualizaValor, setAtualizaValor] = useState(false)

  return (
    <div>
      <Row>
        <FormGroup tag={Col} md='6' sd='12'>
          <InputNumero 
            index={index}
            atualizaValor={atualizaValor}
            labelDoNumero={`${variaveis[index].label} (mínimo)`}
            propriedadeDoNumero={'valorMinimo'}
            setVariaveis={setVariaveis}  
            variaveis={variaveis}
          />
        </FormGroup>
        <FormGroup tag={Col} md='6' sd='12'>
          <InputNumero 
            index={index}
            atualizaValor={atualizaValor}
            labelDoNumero={`${variaveis[index].label} (máximo)`}
            propriedadeDoNumero={'valorMaximo'}
            setVariaveis={setVariaveis}  
            variaveis={variaveis}
          />
        </FormGroup>
      </Row>
    </div>
  )
}

const VariavelIndividual = ({ item, index, operacao, countVariaveis, setCountVariaveis, variaveis, setVariaveis, atualizaFormulario, setAtualizaFormulario }) => {
  const [variavelAberta, setVariavelAberta] = useState(false)
  return (
    <Fragment>
      <HeaderDaVariavel 
        item={item} 
        index={index}
        countVariaveis={countVariaveis}
        setCountVariaveis={setCountVariaveis}
        variaveis={variaveis} 
        setVariaveis={setVariaveis}  
        variavelAberta={variavelAberta}
        setVariavelAberta={setVariavelAberta}
        atualizaFormulario={atualizaFormulario} 
        setAtualizaFormulario={setAtualizaFormulario}                      
      />
      {variavelAberta && <div>
        <NomeDaVariavel 
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis}  
        />
        <TipoDaVariavel
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis} 
        />
        {item.conteudo.tipoDaVariavel === 'Número' && <ConfiguraNumero 
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis}  
        />}
      </div>}
    </Fragment>
  )
}

const itemComErro = (item, componentesDoItem) => {
  let erroNoComponente = false
  componentesDoItem.map(componente => {
    if (!isObjEmpty(componente.erroNoComponente)) erroNoComponente = true || erroNoComponente
  }) 
  
  if (!erroNoComponente && isObjEmpty(item.erroNoItem)) return false
  else return true
}  

const HeaderDoComponente = ({ componente, indexComponente, countComponente, setCountComponente, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, componentesDoItem, setComponentesDoItem, atualizaFormulario, setAtualizaFormulario }) => {                           
  const criaComponente = () => { 
    const item = Object.assign({}, VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM)
    let id = 0
    if (componentesDoItem.length === 1) id = componentesDoItem[0].id + 1
    else {
      const numbers = Array.from(componentesDoItem)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    item.nomeDoComponente = `Componente ${id}`
    componentesDoItem.push(Object.assign({}, item))
    setCountComponente(countComponente + 1)
  }

  const excluiComponente = (i) => {
    if (componentesDoItem.length > 1) {
      const itensCopy = Array.from(componentesDoItem)
      itensCopy.splice(i, 1)
      setComponentesDoItem(itensCopy)
      setCountComponente(countComponente - 1)
    } else {
      const item = VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM
      const id = componentesDoItem[0].id + 1
      item.id = id
      setComponentesDoItem([item])
    } 
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(componentesDoItem[indexComponente].erroNoComponente) ? 'light-primary' : 'light-danger'}  pill>
          {componente.nomeDoComponente}
        </Badge>
        <div className='column-action d-flex align-items-center'>
          <UncontrolledDropdown direction='left'>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaComponente()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar componente</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar componente</span>
              </DropdownItem>                    
{/*               <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Renomear componente</span>
              </DropdownItem>  */}                     
              <DropdownItem className='w-100' onClick={() => excluiComponente(indexComponente)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir componente</span>
              </DropdownItem>
              <DropdownItem className='w-100' >
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar variável</span>
              </DropdownItem>  
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Simular componente</span>
              </DropdownItem>                
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const HeaderDoItem = ({ item, index, count, setCount, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, componentesDoItem, atualizaFormulario, setAtualizaFormulario }) => {                           
  const abreItemNoFormulario = (toOpen) => {
    const copia = itensDaTabelaDePrecos
    copia[index].itemAbertoNoFormulario = toOpen
    setItensDaTabelaDePrecos(copia)
    setAtualizaFormulario(atualizaFormulario + 1)
  }

  const criaItemNoFormulario = () => {
    const item = VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS
    let id = 0
    if (itensDaTabelaDePrecos.length === 1) id = itensDaTabelaDePrecos[0].id + 1
    else {
      const numbers = Array.from(itensDaTabelaDePrecos)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    itensDaTabelaDePrecos.push(Object.assign({}, item))
    setCount(count + 1)
  }

  const excluiItemNoFormulario = (i) => {
    if (itensDaTabelaDePrecos.length > 1) {
      const itensCopy = Array.from(itensDaTabelaDePrecos)
      itensCopy.splice(i, 1)
      setItensDaTabelaDePrecos(itensCopy)
      setCount(count - 1)
    } else {
      const item = VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS
      const id = itensDaTabelaDePrecos[0].id + 1
      item.id = id
      setItensDaTabelaDePrecos([item])
    } 
  }  

  const corDoNomeDoItem = (item) => {    
    if (itemComErro(item, componentesDoItem)) return 'light-danger'
    else {
      if (item.itemHabilitado) return 'primary'
      else return 'light-secondary'
    }  
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={corDoNomeDoItem(item)} pill>
          {item.nomeDoItem}
        </Badge>
        <div className='column-action d-flex align-items-center'>
          <UncontrolledDropdown>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              {!item.itemAbertoNoFormulario && <DropdownItem className='w-100' onClick={() => abreItemNoFormulario(true)} >
                <Eye size={14} className='mr-50' />
                <span className='align-middle'>Abrir item</span>
              </DropdownItem>}
              {item.itemAbertoNoFormulario && <DropdownItem className='w-100' onClick={() => abreItemNoFormulario(false)} >
                <Box size={14} className='mr-50' />
                <span className='align-middle'>Fechar item</span>
              </DropdownItem>}
              <DropdownItem className='w-100' onClick={() => criaItemNoFormulario()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar item</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar item</span>
              </DropdownItem>                      
{/*               <DropdownItem className='w-100' onClick={() => excluiItemNoFormulario(index)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir item</span>
              </DropdownItem> */}
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Simular preço</span>
              </DropdownItem>  
              <DropdownItem className='w-100'>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Salvar tabela</span>
              </DropdownItem>                
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const NomeDoItem = ({ index, itensDaTabelaDePrecos, setItensDaTabelaDePrecos }) => {
  const SignupSchema = yup.object().shape({
    [`nomeDoItem${index}`]: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_ITEM).max(QTDADE_MAX_LETRAS_NOME_DO_ITEM).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  }) 

  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].nomeDoItem = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoItem.nomeDoItem
    else temporaryarray[index].erroNoItem.nomeDoItem = true   
 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const handleChangeItemHabilitado = e => {
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].itemHabilitado = !temporaryarray[index].itemHabilitado 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const handleChangeItemObrigatorioNaProposta = e => {
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].itemObrigatorioNaProposta = !temporaryarray[index].itemObrigatorioNaProposta 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const defaultValue = itensDaTabelaDePrecos[index].nomeDoItem
  const defaultCheckedItemHabilitado = itensDaTabelaDePrecos[index].itemHabilitado 
  const defaultCheckedItemObrigatorioNaProposta = itensDaTabelaDePrecos[index].itemObrigatorioNaProposta

  return (
    <div>
      <p></p>
      <p><code>Nome do item</code> é como aparecerá na proposta</p>
      <Label className='form-label' for={`nomeDoItem${index}`}>
        Nome do item
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <Input
          name={`nomeDoItem${index}`}
          id={`nomeDoItem${index}`}
          placeholder='Nome do item'
          defaultValue={defaultValue}
          autoComplete="off"
          onChange={handleChange}
          innerRef={register({ required: true })}
          invalid={errors[`nomeDoItem${index}`] && true} 
        />
       {errors && errors[`nomeDoItem${index}`] && <FormFeedback>Use entre {QTDADE_MIN_LETRAS_NOME_DO_ITEM} e {QTDADE_MAX_LETRAS_NOME_DO_ITEM} caracteres</FormFeedback>} 
      </InputGroup>
      <CustomInput
        name={`itemHabilitado${index}`}
        id={`itemHabilitado${index}`}
        type='checkbox'
        className='custom-control-success'
        label='Item habilitado?'
        defaultChecked={defaultCheckedItemHabilitado}
        inline
        onChange={handleChangeItemHabilitado}
      />
      <CustomInput
        name={`itemObrigatorioNaProposta${index}`}
        id={`itemObrigatorioNaProposta${index}`}
        type='checkbox'
        className='custom-control-success'
        label='Item obrigatório na proposta?'
        defaultChecked={defaultCheckedItemObrigatorioNaProposta}
        inline
        onChange={handleChangeItemObrigatorioNaProposta}
      />
    </div>
  ) 
}

const ValorFixoDoComponente = ({ index, atualizaValor, componentesDoItem, setComponentesDoItem }) => { 
  const SignupSchema = yup.object().shape({
    [`valorFixoDoComponente${index}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  let defaultValue = null
  if (componentesDoItem[index].hasOwnProperty('valorFixoDoComponente')) defaultValue = componentesDoItem[index].valorFixoDoComponente

  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].valorFixoDoComponente = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoComponente.errors
    else temporaryarray[index].erroNoComponente = errors   
  
    setComponentesDoItem(temporaryarray)
  }

  return (
    <div key={atualizaValor}>
      <Label className='form-label' for={`valorFixoDoComponente${index}`}>
        Valor fixo
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <Input
          name={`valorFixoDoComponente${index}`}
          id={`valorFixoDoComponente${index}`}
          placeholder={"1000,00"}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`valorFixoDoComponente${index}`] && true}
          onChange={handleChange}
        />
        {errors && errors[`valorFixoDoComponente${index}`] && <FormFeedback>Exemplos: 1244 ou 283,15, máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } dígitos</FormFeedback>}
      </InputGroup>
    </div>
  )
}

const VariávelXValorFixo = ({ index, atualizaValor, componentesDoItem, setComponentesDoItem, variaveis }) => { 
  const [variaveisNumericas, setVariaveisNumericas] = useState([])
  let defaultValue = null

  const montaVariaveisNumericas = () => { 
    variaveisNumericas.length = 0
    variaveis.map(variavel => {
      if (variavel.conteudo.tipoDaVariavel === 'Número' || variavel.conteudo.tipoDaVariavel === 'Tabela') variaveisNumericas.push(variavel)
    })  
  }

  useEffect(() => {
    if (variaveis.length) montaVariaveisNumericas()
  }, [variaveis])

  const handleChangeSelect = e => { 
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].variavel = e
    setComponentesDoItem(temporaryarray)
  }

  montaVariaveisNumericas()
  if (componentesDoItem.variavel) defaultValue = componentesDoItem.variavel
  else defaultValue = variaveisNumericas.length ? variaveisNumericas[0] : null

  return (
    <div key={atualizaValor}>
      <FormGroup>
        <Label>Escolha a variável:</Label>
        <Select
          id={`escolhaDeVariavel${index}`}               
          theme={selectThemeColors}
          maxMenuHeight={120}
          className='react-select'
          classNamePrefix='select'
          defaultValue={defaultValue}
          options={variaveisNumericas}
          onChange={handleChangeSelect}
          isClearable={false}
        />
        <ValorFixoDoComponente 
          index={index}
          atualizaValor={atualizaValor}
          componentesDoItem={componentesDoItem}
          setComponentesDoItem={setComponentesDoItem}
        />
      </FormGroup>
    </div>
  )
}

const PrecoDoItem = ({ indexItem, operacao, countComponente, setCountComponente, componentesDoItem, setComponentesDoItem, itensDaTabelaDePrecos, variaveis, setVariaveis, atualizaFormulario, setAtualizaFormulario }) => { 
  const [atualizaValor, setAtualizaValor] = useState(false)
  const setTipoDoComponente = (tipoDoComponente, index) => { 
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].tipoDoComponente = tipoDoComponente  
    temporaryarray[index].valorFixoDoComponente = null
    temporaryarray[index].erroNoComponente = { valorFixoDoComponente: true } 
    if (tipoDoComponente === 'Valor fixo') delete temporaryarray[index].variavel
    setComponentesDoItem(temporaryarray)
    setAtualizaValor(!atualizaValor) 
  }

  return ( 
    <Fragment>
      <p></p>
      <p>O preço do item <b>{itensDaTabelaDePrecos && itensDaTabelaDePrecos[indexItem].nomeDoItem}</b> é a soma dos <code>componentes</code> abaixo:</p>
      <ReactSortable className='row sortable-row' list={componentesDoItem} setList={setComponentesDoItem}>
        {componentesDoItem.map((componente, index) => (
          <Col className='draggable' xl='4' md='6' sm='12' key={componente.id}>
            <Card className={`draggable-cards`}>
              <CardHeader>
                <HeaderDoComponente
                  componente={componente}
                  indexComponente={index}
                  operacao={operacao}
                  countComponente={countComponente}
                  setCountComponente={setCountComponente}
                  componentesDoItem={componentesDoItem}  
                  setComponentesDoItem={setComponentesDoItem} 
                  atualizaFormulario={atualizaFormulario}
                  setAtualizaFormulario={setAtualizaFormulario}   
                />
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Tipo do componente de preço:</Label>
                  <Select
                    id={`tipoDoComponente${index}`}              
                    theme={selectThemeColors}
                    maxMenuHeight={240}
                    className='react-select'
                    classNamePrefix='select'
                    defaultValue={tipoDoComponenteOptions[0]}
                    options={tipoDoComponenteOptions}
                    onChange={e => { setTipoDoComponente(e.value, index) }}
                    isClearable={false}
                  />
                </FormGroup>

                {componentesDoItem[index].tipoDoComponente === 'Valor fixo' && 
                  <ValorFixoDoComponente 
                    index={index}
                    atualizaValor={atualizaValor}
                    componentesDoItem={componentesDoItem}
                    setComponentesDoItem={setComponentesDoItem}
                  />}

                  {componentesDoItem[index].tipoDoComponente === 'Variável x valor fixo' && 
                  <VariávelXValorFixo 
                    index={index}
                    atualizaValor={atualizaValor}
                    componentesDoItem={componentesDoItem}
                    setComponentesDoItem={setComponentesDoItem}
                    variaveis={variaveis}
                  />}
              </CardBody>
            </Card>
          </Col>
        ))}
      </ReactSortable>
    </Fragment>
  )
}

const DescricaoDoItem = ({ item, descricoesDoItem, setDescricoesDoItem }) => {
  const descricaoOptions = [
    { name: 'descricao', value: 'Texto fixo', label: 'Texto fixo' },
    { name: 'descricao', value: 'Texto variável', label: 'Texto variável' }
  ]
  
  const handleChangeSelect = e => {
    const { name, label, value } = e
  }

  return (
    <Fragment>
      <Label>Descrição do item</Label>
      <Button.Ripple color='primary' outline size='sm' className='btn-prev'>
        <Plus size={14} className='align-middle mr-sm-25 mr-0'/>
        <span className='align-middle d-sm-inline-block d-none'>Descrição adicional</span>
      </Button.Ripple>
      <p>Descrição 1</p>
      <Select
        theme={selectThemeColors}
        className='react-select'
        classNamePrefix='select'
        defaultValue={descricaoOptions[0]}
        options={descricaoOptions}
        onChange={handleChangeSelect}
        isClearable={false}
      />
      <p>Descrição 2</p>
      <Select
        theme={selectThemeColors}
        className='react-select'
        classNamePrefix='select'
        defaultValue={descricaoOptions[1]}
        options={descricaoOptions}
        onChange={handleChangeSelect}
        isClearable={false}
      />
    </Fragment>
  )
}

const ItemIndividual = ({ item, index, operacao, count, setCount, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, variaveis, setVariaveis, atualizaFormulario, setAtualizaFormulario }) => {
  const [activeHorizontal, setActiveHorizontal] = useState('A')

  const toggleHorizontal = tab => {
    setActiveHorizontal(tab)
  }

  const [componentesDoItem, setComponentesDoItem] = useState([Object.assign({}, VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM)])
  const [descricoesDoItem, setDescricoesDoItem] = useState([])

  console.log("componentesDoItem=", componentesDoItem) 
//  console.log("descricoesDoItem=", descricoesDoItem) 

  const [countComponente, setCountComponente] = useState(componentesDoItem.length)
  useEffect(() => {
    setCountComponente(componentesDoItem.length)
  }, [componentesDoItem.length]) 

  return (
    <Fragment>
      <HeaderDoItem 
        item={item} 
        index={index}
        count={count}
        setCount={setCount}
        itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
        setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}  
        componentesDoItem={componentesDoItem}
        atualizaFormulario={atualizaFormulario}
        setAtualizaFormulario={setAtualizaFormulario}                      
      />
      {item.itemAbertoNoFormulario && <Row>
        <Col md='12' sm='12'>
          <div className='nav-vertical'>
            <Nav tabs className='nav-left'>
              <NavItem>
                <NavLink
                  active={activeHorizontal === 'A'}
                  onClick={() => {
                    toggleHorizontal('A')
                  }}
                >
                  <Edit size={24} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeHorizontal === 'B'}
                  onClick={() => {
                    toggleHorizontal('B')
                  }}
                >
                  <DollarSign size={24} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeHorizontal === 'C'}
                  onClick={() => {
                    toggleHorizontal('C')
                  }}
                >
                  <List size={24} />
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeHorizontal}>
              <TabPane tabId='A'>
                <NomeDoItem 
                  index={index} 
                  itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
                  setItensDaTabelaDePrecos={setItensDaTabelaDePrecos} 
                />
              </TabPane>
              <TabPane tabId='B'>
                <PrecoDoItem 
                  indexItem={index}
                  operacao={operacao}
                  countComponente={countComponente}
                  setCountComponente={setCountComponente}
                  componentesDoItem={componentesDoItem}
                  setComponentesDoItem={setComponentesDoItem} 
                  itensDaTabelaDePrecos={itensDaTabelaDePrecos}
                  variaveis={variaveis}
                  setVariaveis={setVariaveis}
                  atualizaFormulario={atualizaFormulario}
                  setAtualizaFormulario={setAtualizaFormulario}                      
                /> 
              </TabPane>
              <TabPane tabId='C'>
                <DescricaoDoItem descricoesDoItem={descricoesDoItem} setDescricoesDoItem={setDescricoesDoItem} />
              </TabPane>
            </TabContent>
          </div>
        </Col>
      </Row>}
    </Fragment>
  )
}

const ItensDePreco = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, variaveis, setVariaveis, operacao, stepper, type }) => {
  const [activeVertical, setactiveVertical] = useState('1')
  const [atualizaFormulario, setAtualizaFormulario] = useState(0)

  const toggleVertical = tab => {
    setactiveVertical(tab) 
  }

  const [count, setCount] = useState(itensDaTabelaDePrecos.length)
  useEffect(() => {
    setCount(itensDaTabelaDePrecos.length)
  }, [itensDaTabelaDePrecos.length]) 

  const [countVariaveis, setCountVariaveis] = useState(variaveis.length)
  useEffect(() => {
    setCountVariaveis(variaveis.length)
  }, [variaveis.length]) 

  console.log("==================== No ItensDePreco")
  console.log("itensDaTabelaDePrecos=", itensDaTabelaDePrecos)  
  console.log("variaveis=", variaveis) 

  return (
    <Fragment>    
      <Nav className='justify-content-end' pills>
        <NavItem>
          <NavLink
            active={activeVertical === '1'}
            onClick={() => {
              toggleVertical('1')
            }}
          >
            Itens de preço
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeVertical === '2'}
            onClick={() => {
              toggleVertical('2')
            }}
          >
            Variáveis
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeVertical === '3'}
            onClick={() => {
              toggleVertical('3')
            }}
          >
            Descrições
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent className='py-50' activeTab={activeVertical}>
        <TabPane tabId='1'>
          <div key={atualizaFormulario}>
            <h4 tag='h4'>Itens de preço</h4>
            <p><code>Itens de preço</code> são bla bla bla.</p>
            <ReactSortable
              tag='ul'
              className='list-group'
              list={itensDaTabelaDePrecos}
              setList={setItensDaTabelaDePrecos}
            >
              {itensDaTabelaDePrecos.map((item, index) => {
                return (
                  <ListGroupItem key={item.id}>
                    <ItemIndividual 
                      item={item}
                      index={index}
                      operacao={operacao}
                      count={count}
                      setCount={setCount}
                      itensDaTabelaDePrecos={itensDaTabelaDePrecos}
                      setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}
                      variaveis={variaveis}
                      setVariaveis={setVariaveis}
                      atualizaFormulario={atualizaFormulario}
                      setAtualizaFormulario={setAtualizaFormulario}
                    />
                  </ListGroupItem>
                )
              })}
            </ReactSortable>
          </div>
        </TabPane>

        <TabPane tabId='2'>
          <div key={atualizaFormulario}>
            <h4 tag='h4'>Variáveis</h4>
            <p><code>Nome da variável</code> é como esta informacão aparecerá na criação de uma proposta.</p>
            <ReactSortable
              tag='ul'
              className='list-group'
              list={variaveis}
              setList={setVariaveis}
            >
              {variaveis.map((item, index) => {
                return (
                  <ListGroupItem key={item.id}>
                    <VariavelIndividual 
                      item={item}
                      index={index}
                      operacao={operacao}
                      countVariaveis={countVariaveis}
                      setCountVariaveis={setCountVariaveis}
                      variaveis={variaveis}
                      setVariaveis={setVariaveis}
                      atualizaFormulario={atualizaFormulario}
                      setAtualizaFormulario={setAtualizaFormulario}
                    />
                  </ListGroupItem>
                )
              })}
            </ReactSortable>
          </div>
        </TabPane>
        
        <TabPane tabId='3'>
          Quais são as opções?
          - salvar proposta (habilitar se tem pelo menos 1 item de preço) 
          - visualizar parâmetros
          - visualizar tabela de preços 
          -simular preços
        </TabPane>
      </TabContent>

      <div className='d-flex justify-content-between'>
        <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
        </Button.Ripple>
        <Button.Ripple color='primary' className='btn-next' onClick={() => stepper.next()}>
          <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
          <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
        </Button.Ripple>
      </div>
    </Fragment>
  )
}

export default ItensDePreco
