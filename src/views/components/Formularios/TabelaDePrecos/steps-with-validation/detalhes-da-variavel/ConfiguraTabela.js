import { Fragment, useState, useEffect } from 'react'
import { Copy, Edit, MoreVertical } from 'react-feather'
import { Row, Badge, ListGroup, ListGroupItem, UncontrolledDropdown, Input, DropdownToggle, InputGroup, FormGroup, Col, DropdownMenu, DropdownItem, FormFeedback, Label, Alert } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO } from '../../../../../../configs/appProposta'

// PAREI AQUI:
// - repetir o input do número da 2ª coluna do intevalo na 1ª coluna do intervalo seguinte
// - ao criar ou excluir intervalos: tentar preencher os campos
// - Implementar o PreenchimentoDaTabela
// - fazer as consistencias e mensagens de erro da tabela

const InputNumeroNoIntervalo = ({ indexDoIntervalo, dimensao, labelDoNumero, propriedadeDoNumero, tabela, setTabela }) => { 
  const SignupSchema = yup.object().shape({
    [`inputNumero${labelDoNumero}${indexDoIntervalo}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^-?\d*,?\d+$/).required() 
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const defaultValue = tabela[dimensao].intervalos[indexDoIntervalo][propriedadeDoNumero]

  const handleChange = e => {
    const { value } = e.target
    const tabelaTemporaria = Object.assign({}, tabela)
    tabelaTemporaria[dimensao].intervalos[indexDoIntervalo][propriedadeDoNumero] = value

    if (propriedadeDoNumero === 'maiorOuIgualA' && indexDoIntervalo > 0) tabelaTemporaria[dimensao].intervalos[indexDoIntervalo - 1].menorQue = value
    if (propriedadeDoNumero === 'menorQue' && indexDoIntervalo + 1 < tabelaTemporaria[dimensao].intervalos.length) tabelaTemporaria[dimensao].intervalos[indexDoIntervalo + 1].maiorOuIgualA = value

/*     if (isObjEmpty(errors)) delete temporaryarray[index].erroNaVariavel.errors
    else temporaryarray[dimensao].intervalos[indexDoIntervalo] = errors    */
  
    setTabela(tabelaTemporaria)
  }

  return (
    <div>
      <Label className='form-label' for={`inputNumero${labelDoNumero}${indexDoIntervalo}`}>
        {labelDoNumero}
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <Input
          name={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          id={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          placeholder={`${labelDoNumero}`}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`inputNumero${labelDoNumero}${indexDoIntervalo}`] && true}
          onChange={handleChange}
        />
        {errors && errors[`inputNumero${labelDoNumero}${indexDoIntervalo}`] && <FormFeedback>Máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } caracteres (incluindo números, vírgula e sinal de menos)</FormFeedback>}
      </InputGroup> 
    </div>
  )
}
 
const quantidadeDeVariaveisDaTabela = [
  { name: 'quantidadeDeVariaveisDaTabela', value: 1, label: '1 dimensão' },
  { name: 'quantidadeDeVariaveisDaTabela', value: 2, label: '2 dimensões' }
]

const findVariavelById = (variaveis, id) => { 
  return variaveis.findIndex(element => element.id === id)
}

const HeaderDoPreenchimento = ({ index, tabela, setTabela, countOpcoes, setCountOpcoes }) => {                           
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

const HeaderDoIntervalo = ({ indexDoIntervalo, intervalo, dimensao, setCountIntervalos, tabela, setTabela }) => {    
  const intervaloVazio = Object.assign({}, { 
    maiorOuIgualA: null, 
    menorQue: null, 
    erroNoIntervalo: {} 
  })

  const criaIntervalo = () => { 
    const tabelaTemporaria = Object.assign({}, tabela)
    tabelaTemporaria[dimensao].intervalos.push(Object.assign({}, intervaloVazio))
//    indexDoNovoIntervalo = tabelaTemporaria[dimensao].intervalos.length
    setTabela(tabelaTemporaria)
  } 

  const excluiIntervalo = (i) => {
    const tabelaTemporaria = Object.assign({}, tabela)
    if (tabelaTemporaria[dimensao].intervalos.length > 2) {
      const itensCopy = Array.from(tabelaTemporaria[dimensao].intervalos)
      itensCopy.splice(i, 1)
      tabelaTemporaria[dimensao].intervalos.length = 0
      tabelaTemporaria[dimensao].intervalos = itensCopy
      setTabela(tabelaTemporaria)
    } // else, não deixa ter menos do que 2 intervalos
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(intervalo.erroNoIntervalo) ? 'primary' : 'light-danger'}  pill>
          Intervalo {indexDoIntervalo + 1}
        </Badge>
        <div className='column-action d-flex align-items-center'> 
          <UncontrolledDropdown direction='left'>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaIntervalo()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar intervalo</span>
              </DropdownItem>                                             
              <DropdownItem className='w-100' onClick={() => excluiIntervalo(indexDoIntervalo)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir intervalo</span>
              </DropdownItem>               
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const ConfiguraIntervalos = ({ index, variaveis, dimensao, tabela, setTabela }) => {
  const [countIntervalos, setCountIntervalos] = useState(3)
  console.log("countIntervalos=", countIntervalos)
  console.log("tabela[dimensao].intervalos=", tabela[dimensao].intervalos)

  useEffect(() => {
    setCountIntervalos(tabela[dimensao].intervalos.length)
  }, [tabela[dimensao].intervalos.length])  
  
  return (
    <Fragment>
      <div key={countIntervalos}>
        <p>Preencha com os <code>intervalos</code> desta variável.</p>
        <ListGroup>
          {tabela[dimensao].intervalos.map((intervalo, indexDoIntervalo) => {
            return (
              <ListGroupItem key={indexDoIntervalo}>
                <HeaderDoIntervalo
                  indexDoIntervalo={indexDoIntervalo}
                  intervalo={intervalo}
                  dimensao={dimensao}
                  setCountIntervalos={setCountIntervalos}
                  tabela={tabela}
                  setTabela={setTabela}  
                />
                <Row>
                  <FormGroup tag={Col} md='6' sd='6'>
                    <InputNumeroNoIntervalo 
                      indexDoIntervalo={indexDoIntervalo}
                      dimensao={dimensao}
                      id={`maiorOuIgualA${index}`}
                      labelDoNumero={`Maior ou iguar a:`}
                      propriedadeDoNumero={'maiorOuIgualA'}
                      tabela={tabela}
                      setTabela={setTabela}  
                    />
                  </FormGroup>
                  <FormGroup tag={Col} md='6' sd='6'>
                    <InputNumeroNoIntervalo 
                      indexDoIntervalo={indexDoIntervalo}
                      dimensao={dimensao}
                      id={`menorQue${index}`}
                      labelDoNumero={`Menor que:`}
                      propriedadeDoNumero={'menorQue'}
                      tabela={tabela}
                      setTabela={setTabela}  
                    />
                  </FormGroup>
                </Row>
              </ListGroupItem>
            )
          })}
        </ListGroup>
      </div>
    </Fragment>
  )
}

const ConfiguraTabela = ({ index, variaveis, tabela, setTabela }) => {
  const [quantidadeDeDimensoesDaTabela, setQuantidadeDeDimensoesDaTabela] = useState(0) 
  const [dimensoesOptions, setDimensoesOptions] = useState([]) // Precisa verificar se dimensoesOptions é maior que zero
//  let defaultValue = null

  const montaDimensoes = () => { 
    dimensoesOptions.length = 0
    variaveis.map(variavel => {
      if (variavel.conteudo.tipoDaVariavel === 'NUMERO' || variavel.conteudo.tipoDaVariavel === 'SIMNAO' || variavel.conteudo.tipoDaVariavel === 'SELECAO') {
        dimensoesOptions.push(variavel)
      }
    })  
  }

  useEffect(() => {
    if (variaveis.length) montaDimensoes()
  }, [variaveis])

  montaDimensoes()
/*   if (componentesDoItem.variavel) defaultValue = componentesDoItem.variavel
  else defaultValue = variaveisNumericas.length ? variaveisNumericas[0] : null */

  const setQuantidadeDeDimensoes = (quantidade) => { 
    const tabelaTemporaria = Object.assign({}, tabela)

    if (!tabelaTemporaria.hasOwnProperty('dimensao1')) tabelaTemporaria.dimensao1 = { id: null }

    if (quantidade === 1) {
      delete tabelaTemporaria.dimensao2
      if (tabelaTemporaria.hasOwnProperty('erroNaTabela')) delete tabelaTemporaria.erroNaTabela.dimesaoDuplicada
    } else if (!tabelaTemporaria.hasOwnProperty('dimensao2')) tabelaTemporaria.dimensao2 = { id: null }
    
    setTabela(tabelaTemporaria)
    setQuantidadeDeDimensoesDaTabela(quantidade)
  }

  const montaIntervalos = (variavel) => {
    const { valorMinimo, valorMaximo} =  variavel
    if (valorMinimo && valorMaximo) {
      const minimo = parseFloat(valorMinimo.replace(",", "."))
      const maximo = parseFloat(valorMaximo.replace(",", "."))  
      const diferenca = maximo - minimo
      const i1 = diferenca >= 3 ? (Math.round(diferenca / 3) + minimo).toString() : null
      const i2 = diferenca >= 3 ? ((Math.round(diferenca / 3) * 2) + minimo).toString() : null
      return [
        { 
          maiorOuIgualA: valorMinimo, 
          menorQue: i1, 
          erroNoIntervalo: {} 
        }, 
        { 
          maiorOuIgualA: i1, 
          menorQue: i2, 
          erroNoIntervalo: {} 
        }, 
        { 
          maiorOuIgualA: i2, 
          menorQue: valorMaximo, 
          erroNoIntervalo: {} 
        }
      ]
    } else {
      if (valorMinimo) return [
        { 
          maiorOuIgualA: valorMinimo, 
          menorQue: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          maiorOuIgualA: null, 
          menorQue: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          maiorOuIgualA: null, 
          menorQue: null, 
          erroNoIntervalo: {} 
        }
      ]
      if (valorMaximo) return [
        { 
          maiorOuIgualA: null, 
          menorQue: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          maiorOuIgualA: null, 
          menorQue: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          maiorOuIgualA: null, 
          menorQue: valorMaximo, 
          erroNoIntervalo: {} 
        }
      ]
    }
  }

  const setDimensao = (dimensaoEscolhida, dimensao) => { 
    const tabelaTemporaria = Object.assign({}, tabela)
    
    tabelaTemporaria[dimensao].id = dimensaoEscolhida.id
    
    if (dimensaoEscolhida.conteudo.tipoDaVariavel === 'NUMERO') {
      if (!tabelaTemporaria[dimensao].hasOwnProperty('intervalos')) tabelaTemporaria[dimensao].intervalos = montaIntervalos(dimensaoEscolhida.conteudo)
    } else delete tabelaTemporaria[dimensao].intervalos

    if (tabelaTemporaria.hasOwnProperty('dimensao2')) {
      if (tabelaTemporaria.dimensao2.id) {
        if (tabelaTemporaria.dimensao1.id === tabelaTemporaria.dimensao2.id) tabelaTemporaria.erroNaTabela.dimesaoDuplicada = true
        else delete tabelaTemporaria.erroNaTabela.dimesaoDuplicada
      }
    }

    setTabela(tabelaTemporaria)
  }

  console.log("tabela=", tabela) 

  // Incluir no Select abaixo: value={tipoDaVariavelOptions[tipoDaVariavelOptions.findIndex(element => element.value === variaveis[index].conteudo.tipoDaVariavel)]}
  return (
    <Fragment>
      {/* Caso dimensoesOptions.lenght === 0 então far um alerta e retornar */}

      {dimensoesOptions.length && <Label className='form-label' for={`quantidadeDeVariaveisDaTabela${index}`}>Tabela com 1 ou 2 dimensões?</Label>}
      {dimensoesOptions.length === 1 && <Select
        id={`quantidadeDeVariaveisDaTabela${index}`}               
        theme={selectThemeColors}
        maxMenuHeight={120}
        className='react-select'
        classNamePrefix='select'
        options={quantidadeDeVariaveisDaTabela}
        defaultValue={quantidadeDeVariaveisDaTabela[0]}
        onChange={e => { setQuantidadeDeDimensoes(e.value) }}
        isClearable={false}
        isDisabled={true}
      />}
      {dimensoesOptions.length === 2 && <Select
        id={`quantidadeDeVariaveisDaTabela${index}`}               
        theme={selectThemeColors}
        maxMenuHeight={120}
        className='react-select'
        classNamePrefix='select'
        options={quantidadeDeVariaveisDaTabela}
        onChange={e => { setQuantidadeDeDimensoes(e.value) }}
        isClearable={false}
      />}

      {quantidadeDeDimensoesDaTabela > 0 && <div>
        <Label className='form-label' for={`dimensao1${index}`}>Escolha a{quantidadeDeDimensoesDaTabela === 2 && ' 1ª'} dimensão:</Label>      
        <Select
          id={`dimensao1${index}`}               
          theme={selectThemeColors}
          maxMenuHeight={120}
          className='react-select'
          classNamePrefix='select'
          options={dimensoesOptions}
          onChange={e => { setDimensao(e, 'dimensao1') }}
          isClearable={false}
        />
        {tabela.hasOwnProperty('dimensao1') && tabela.dimensao1.hasOwnProperty('id') && tabela.dimensao1.id && variaveis[findVariavelById(variaveis, tabela.dimensao1.id)].conteudo.tipoDaVariavel === 'NUMERO' && <ConfiguraIntervalos
          index={index}
          variaveis={variaveis}
          dimensao='dimensao1'
          tabela={tabela}
          setTabela={setTabela}  
        />} 
      </div>}

      {quantidadeDeDimensoesDaTabela === 2 && <div>
        <Label className='form-label' for={`dimensao2${index}`}>Escolha a 2ª dimensão:</Label>      
        <Select
          id={`dimensao2${index}`}               
          theme={selectThemeColors}
          maxMenuHeight={120}
          className='react-select'
          classNamePrefix='select'
          options={dimensoesOptions}
          onChange={e => { setDimensao(e, 'dimensao2') }}
          isClearable={false}
        />
        {tabela.erroNaTabela && tabela.erroNaTabela.dimesaoDuplicada && <Alert color='danger'>Escolha dimensões distintas</Alert>}
      </div>}
    </Fragment>
  )
}

export default ConfiguraTabela
