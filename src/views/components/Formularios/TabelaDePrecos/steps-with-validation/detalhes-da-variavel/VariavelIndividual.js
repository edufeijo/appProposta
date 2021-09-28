import { Fragment, useState, useEffect } from 'react'
import { Edit, MoreVertical } from 'react-feather'
import { Row, Badge, UncontrolledDropdown, DropdownToggle, CustomInput, Label, InputGroup, Input, DropdownMenu, DropdownItem, FormFeedback } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { VALORES_INICIAIS_DA_VARIAVEL_NUMERO, QTDADE_MIN_LETRAS_NOME_DA_VARIAVEL, QTDADE_MAX_LETRAS_NOME_DA_VARIAVEL, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO } from '../../../../../../configs/appProposta'
import ConfiguraSelecao from './ConfiguraSelecao'
import ConfiguraNumero from './ConfiguraNumero'
import ConfiguraTabela from './ConfiguraTabela'

const tipoDaVariavelOptions = [
  { name: 'tipoDaVariavel', value: 'NUMERO', label: 'Número' },
  { name: 'tipoDaVariavel', value: 'SIMNAO', label: 'Sim ou não' },
  { name: 'tipoDaVariavel', value: 'SELECAO', label: 'Seleção' },
  { name: 'tipoDaVariavel', value: 'ALFANUMERICA', label: 'Alfanumérica' },
  { name: 'tipoDaVariavel', value: 'DATA', label: 'Data' },
  { name: 'tipoDaVariavel', value: 'TABELA', label: 'Tabela' }
]

const VALORES_INICIAIS_DA_VARIAVEL_SIM_OU_NAO = {
  tipoDaVariavel: 'SIMNAO',
  permitidoAlterar: {
    tipoDaVariavel: true
  }
}

const VALORES_INICIAIS_DA_VARIAVEL_SELECAO = {
  tipoDaVariavel: 'SELECAO',
  opcoes: [],
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
  },
  erroNaTabela: {}
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

const variavelComErroNasOpcoes = (variavel, opcoes) => {  
  let erroNaOpcao = false
  opcoes.map(opcao => {
    if (!isObjEmpty(opcao.erroNaOpcao)) erroNaOpcao = true || erroNaOpcao
  }) 
  
  if (!erroNaOpcao && isObjEmpty(variavel.erroNaVariavel)) return false
  else return true
}  

const variavelComErroNaTabela = (item) => {  
  let erroNaTabela = false
  if (item.conteudo.hasOwnProperty('dimensao1') && item.conteudo.dimensao1.hasOwnProperty('intervalos')) {
    item.conteudo.dimensao1.intervalos.map(intervalo => {
      if (!isObjEmpty(intervalo.erroNoIntervalo)) erroNaTabela = true || erroNaTabela
    }) 
  }

  if (item.conteudo.hasOwnProperty('dimensao2') && item.conteudo.dimensao2.hasOwnProperty('intervalos')) {
    item.conteudo.dimensao2.intervalos.map(intervalo => {
      if (!isObjEmpty(intervalo.erroNoIntervalo)) erroNaTabela = true || erroNaTabela
    }) 
  }

  if (!erroNaTabela && isObjEmpty(item.erroNaVariavel)) return false
  else return true
}  
 
const HeaderDaVariavel = ({ item, index, opcoes, countVariaveis, setCountVariaveis, variaveis, setVariaveis, variavelAberta, setVariavelAberta, atualizaFormulario, setAtualizaFormulario }) => {     
  const criaVariavelNoFormulario = () => { 
    const item = Object.assign({}, VALORES_INICIAIS_DA_VARIAVEL)
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
    item.conteudo = Object.assign({}, VALORES_INICIAIS_DA_VARIAVEL_NUMERO)
    variaveis.push(Object.assign({}, item))

    console.log("---------------------------------")
    console.log("item=", item)
    console.log("variaveis=", variaveis)

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
//    if (variavelComErroNasOpcoes(item, opcoes)) return 'light-danger'
    if (item.conteudo.tipoDaVariavel === 'TABELA') {
      if (variavelComErroNaTabela(item)) return 'light-danger'
    } 

    if (!isObjEmpty(item.erroNaVariavel)) return 'light-danger'
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
    <Fragment>
      <Label className='form-label' for={`nomeDaVariavel${index}`}>
        Nome da variável:
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
    </Fragment>
  ) 
}

const FlagsDaVariavel = ({ index, variaveis, setVariaveis }) => {
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
      <p></p>
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
      <p></p>
    </Fragment>
  )
}

const TipoDaVariavel = ({ index, variaveis, setVariaveis }) => {
  const setTipoDaVariavel = (tipoDaVariavel, index) => { 
    const temporaryarray = Array.from(variaveis)
    
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
    if (tipoDaVariavel === 'TABELA') temporaryarray[index].conteudo = Object.assign({}, VALORES_INICIAIS_DA_VARIAVEL_TABELA)

    setVariaveis(temporaryarray)
  }

  return ( 
    <Fragment>
      <Label className='form-label' for={`tipoDaVariavel${index}`}>Tipo da variável:</Label>
      <Select
        id={`tipoDaVariavel${index}`}               
        theme={selectThemeColors}
        maxMenuHeight={120}
        className='react-select'
        classNamePrefix='select'
        value={tipoDaVariavelOptions[tipoDaVariavelOptions.findIndex(element => element.value === variaveis[index].conteudo.tipoDaVariavel)]}
        options={tipoDaVariavelOptions}
        onChange={e => { setTipoDaVariavel(e.value, index) }}
        isClearable={false}
        isDisabled={!variaveis[index].conteudo.permitidoAlterar.tipoDaVariavel}
      />
      <p></p>
    </Fragment>
  )
}

const VariavelIndividual = ({ item, index, operacao, countVariaveis, setCountVariaveis, variaveis, setVariaveis, atualizaFormulario, setAtualizaFormulario }) => {
  const [variavelAberta, setVariavelAberta] = useState(false)
  const [opcoes, setOpcoes] = useState([Object.assign({}, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO)]) 
  const [tabela, setTabela] = useState(Object.assign({}, VALORES_INICIAIS_DA_VARIAVEL_TABELA)) 

  useEffect(() => {
    if (variaveis[index].conteudo.tipoDaVariavel === 'TABELA') {
      const temporaryarray = Array.from(variaveis)
      
      temporaryarray[index].conteudo = tabela
      setVariaveis(temporaryarray)
    } 
  }, [tabela]) 

  return (
    <Fragment>
      <HeaderDaVariavel 
        item={item} 
        index={index}
        opcoes={opcoes}
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
        <FlagsDaVariavel
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis} 
        />
        <TipoDaVariavel
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis} 
        />
        {item.conteudo.tipoDaVariavel === 'NUMERO' && <ConfiguraNumero 
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis}  
        />}
        {item.conteudo.tipoDaVariavel === 'SELECAO' && <ConfiguraSelecao 
          index={index} 
          opcoes={opcoes}
          setOpcoes={setOpcoes}
          variaveis={variaveis} 
          setVariaveis={setVariaveis}  
        />}
        {item.conteudo.tipoDaVariavel === 'TABELA' && <ConfiguraTabela 
          index={index} 
          variaveis={variaveis} 
          setVariaveis={setVariaveis}  
          tabela={tabela}
          setTabela={setTabela}
        />}
      </div>}
    </Fragment>
  )
}

export default VariavelIndividual
