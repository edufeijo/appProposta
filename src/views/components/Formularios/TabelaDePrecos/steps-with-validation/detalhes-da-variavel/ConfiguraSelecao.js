import { Fragment, useState, useEffect } from 'react'
import { Copy, Edit, MoreVertical } from 'react-feather'
import { Row, Badge, ListGroupItem, UncontrolledDropdown, DropdownToggle, InputGroup, Input, DropdownMenu, DropdownItem, FormFeedback } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import { isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_OPCAO_DA_SELECAO, QTDADE_MAX_LETRAS_OPCAO_DA_SELECAO, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO } from '../../../../../../configs/appProposta'
 
const HeaderDaOpcaoDaSelecao = ({ index, opcoes, setOpcoes, countOpcoes, setCountOpcoes }) => {                           
  const criaOpcao = () => { 
    const item = Object.assign({}, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO)
    let id = 0
    if (opcoes.length === 1) id = opcoes[0].id + 1
    else {
      const numbers = Array.from(opcoes)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    item.label = `Opção ${opcoes.length + 1}`
    opcoes.push(Object.assign({}, item))

    console.log("-------------------------")
    console.log("item=", item)
    console.log("opcoes=", opcoes)
    setCountOpcoes(countOpcoes + 1)
  }

  const excluiOpcao = (i) => {
    if (opcoes.length > 1) {
      const itensCopy = Array.from(opcoes)
      itensCopy.splice(i, 1)
      setOpcoes(itensCopy)
      setCountOpcoes(countOpcoes - 1)
    } else {
      const item = VALORES_INICIAIS_DA_OPCAO_DA_SELECAO
      const id = opcoes[0].id + 1
      item.id = id
      setOpcoes([item])
    } 
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(opcoes[index].erroNaOpcao) ? 'light-primary' : 'light-danger'}  pill>
          Opção {index + 1}
        </Badge>
        <div className='column-action d-flex align-items-center'> 
          <UncontrolledDropdown direction='left'>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaOpcao()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar opção</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar opção</span>
              </DropdownItem>                                 
              <DropdownItem className='w-100' onClick={() => excluiOpcao(index)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir opção</span>
              </DropdownItem>               
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const InputOpcaoDaSelecao = ({ index, indexDaOpcao, variaveis, setVariaveis, opcoes, setOpcoes, countOpcoes, setCountOpcoes }) => {
  const SignupSchema = yup.object().shape({ 
    [`opcaoDaSelecao${indexDaOpcao}`]: yup.string().min(QTDADE_MIN_LETRAS_OPCAO_DA_SELECAO).max(QTDADE_MAX_LETRAS_OPCAO_DA_SELECAO).required()
  }) 

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  }) 

  const handleChange = (e, index) => {
    const { value } = e.target    
    const temporaryarray = Array.from(opcoes)
    temporaryarray[index].label = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNaOpcao.label
    else temporaryarray[index].erroNaOpcao = errors   

    console.log("index=", index)
    console.log("errors=", errors)  
    console.log("temporaryarray=", temporaryarray)  

    setOpcoes(temporaryarray)
  }

  let defaultValue = null
  if (variaveis && variaveis[index].conteudo.opcoes && variaveis[index].conteudo.opcoes.length) defaultValue = variaveis[index].conteudo.opcoes[indexDaOpcao].label
  else defaultValue = opcoes[indexDaOpcao].label

  console.log("index=", index)
  console.log("indexDaOpcao=", indexDaOpcao)
  console.log("opcoes=", opcoes)
  console.log("defaultValue=", defaultValue)

  return (
    <Fragment>
      <HeaderDaOpcaoDaSelecao 
        index={indexDaOpcao}
        opcoes={opcoes}
        setOpcoes={setOpcoes}
        countOpcoes={countOpcoes}
        setCountOpcoes={setCountOpcoes}
      />
      <InputGroup className='input-group-merge mb-2'>
        <Input
          name={`opcaoDaSelecao${indexDaOpcao}`}
          id={`opcaoDaSelecao${indexDaOpcao}`}
          placeholder={`Preencha com a opção ${indexDaOpcao}`}
          defaultValue={defaultValue}
          autoComplete="off"
          onChange={e => { handleChange(e, indexDaOpcao) }}
          innerRef={register({ required: true })}
          invalid={errors[`opcaoDaSelecao${indexDaOpcao}`] && true} 
        />
        {errors && errors[`opcaoDaSelecao${indexDaOpcao}`] && <FormFeedback>Use entre {QTDADE_MIN_LETRAS_OPCAO_DA_SELECAO} e {QTDADE_MAX_LETRAS_OPCAO_DA_SELECAO} caracteres</FormFeedback>} 
      </InputGroup>
    </Fragment>
  ) 
}

const ConfiguraSelecao = ({ index, variaveis, setVariaveis, opcoes, setOpcoes }) => {
  const [countOpcoes, setCountOpcoes] = useState(opcoes.length)
 
  useEffect(() => {
    setCountOpcoes(opcoes.length)
  }, [opcoes.length]) 
  
  return (
    <Fragment>
      <div key={countOpcoes}>
        <p>Preencha com as <code>opções</code> desta variável.</p>
        <ReactSortable
          tag='ul'
          className='list-group'
          list={opcoes}
          setList={setOpcoes}
        >
          {opcoes.map((item, indexDaOpcao) => {
            return (
              <ListGroupItem key={item.id}>
                <InputOpcaoDaSelecao
                  index={index} 
                  indexDaOpcao={indexDaOpcao}
                  variaveis={variaveis} 
                  setVariaveis={setVariaveis} 
                  opcoes={opcoes}
                  setOpcoes={setOpcoes}
                  countOpcoes={countOpcoes}
                  setCountOpcoes={setCountOpcoes}
                />
              </ListGroupItem>
            )
          })}
        </ReactSortable>
      </div>
    </Fragment>
  )
}

export default ConfiguraSelecao
