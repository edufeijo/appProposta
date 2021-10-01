import { Fragment, useState, useEffect } from 'react'
import { Trash, Copy, Edit, MoreVertical, Plus, Lock } from 'react-feather'
import { Table, CustomInput, Button, Row, Badge, ListGroup, ListGroupItem, UncontrolledDropdown, Input, DropdownToggle, InputGroup, FormGroup, Col, DropdownMenu, DropdownItem, FormFeedback, Label, Alert } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO } from '../../../../../../configs/appProposta'

// PAREI AQUI:
// - Finalizar o PreenchimentoDaTabela, incluindo erro enquanto nnao finalizar o preenchimento

const quantidadeDeVariaveisDaTabela = [
  { name: 'quantidadeDeVariaveisDaTabela', value: 1, label: '1 dimensão' },
  { name: 'quantidadeDeVariaveisDaTabela', value: 2, label: '2 dimensões' }
]

const findVariavelById = (variaveis, id) => { 
  return variaveis.findIndex(element => element.id === id)
}

const InputNumeroNoIntervalo = ({ index, variaveis, setVariaveis, indexDoIntervalo, dimensao, labelDoNumero, tabela, setTabela}) => { 
  const SignupSchema = yup.object().shape({
    [`inputNumero${labelDoNumero}${indexDoIntervalo}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^-?\d*,?\d+$/).required() 
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const defaultValue = tabela[dimensao].intervalos[indexDoIntervalo]
  const ultimoIntervalo = tabela[dimensao].intervalos.length - 1

  const handleChange = e => {
    const { value } = e.target
    const tabelaTemporaria = Object.assign({}, tabela)
    tabelaTemporaria[dimensao].intervalos[indexDoIntervalo] = value

    const temporaryarray = Array.from(variaveis)
    if (isObjEmpty(errors)) delete temporaryarray[index].erroNaVariavel[`valor-${dimensao}-${indexDoIntervalo}$`]
    else temporaryarray[index].erroNaVariavel[`valor-${dimensao}-${indexDoIntervalo}$`] = true
  
    setVariaveis(temporaryarray)
    setTabela(tabelaTemporaria)
  }

  return (
    <Fragment>
      <Label className='form-label' for={`inputNumero${labelDoNumero}${indexDoIntervalo}`}>
        {labelDoNumero}
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        {!(indexDoIntervalo === 0 || indexDoIntervalo === ultimoIntervalo) && <Input
          name={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          id={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          placeholder={`${labelDoNumero}`}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`inputNumero${labelDoNumero}${indexDoIntervalo}`] && true}
          onChange={handleChange}
        />}
        {(indexDoIntervalo === 0 || indexDoIntervalo === ultimoIntervalo) && <Input
          name={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          id={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          placeholder={defaultValue === null ? `Não há valor definido` : defaultValue}
          defaultValue={defaultValue}
          disabled={true}
        />}
        {errors && errors[`inputNumero${labelDoNumero}${indexDoIntervalo}`] && <FormFeedback>Máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } caracteres (incluindo números, vírgula e sinal de menos)</FormFeedback>}
      </InputGroup> 
    </Fragment>
  )
}

const ConfiguraIntervalos = ({ index, variaveis, setVariaveis, dimensao, tabela, setTabela }) => {
  const [countIntervalos, setCountIntervalos] = useState(4)
  const ultimoIntervalo = tabela[dimensao].intervalos.length - 1

  useEffect(() => {
    setCountIntervalos(tabela[dimensao].intervalos.length)
  }, [tabela[dimensao].intervalos.length])  

  const erroNosIntervalos = () => {
    let erroNoIntervalo = null
    tabela[dimensao].intervalos.map((intervalo, index) => {
      if (index > 0 && index < tabela[dimensao].intervalos.length - 1) {
        if (intervalo === null || intervalo === '') {
          erroNoIntervalo = 'campo-vazio'
        }
      } 
    })

    if (!erroNoIntervalo) {
      tabela[dimensao].intervalos.map((intervalo, index) => {
        if (index === 1) {
          const campo1Vazio = tabela[dimensao].intervalos[0] === null || tabela[dimensao].intervalos[0] === ''
          const campo2Vazio = intervalo === null || intervalo === ''
          if (!(campo1Vazio || campo2Vazio)) {
            const op1 = parseFloat(tabela[dimensao].intervalos[0].replace(",", "."))
            const op2 = parseFloat(intervalo.replace(",", "."))
            if (op1 >= op2) {
              erroNoIntervalo = 'fora-de-ordem'
            }
          }
        } else {
          const ultimo = tabela[dimensao].intervalos.length - 1
          if (index === ultimo) {
            const campoVazio = tabela[dimensao].intervalos[ultimo] === null || tabela[dimensao].intervalos[ultimo] === ''
            if (!campoVazio) {
              const op1 = parseFloat(intervalo.replace(",", "."))
              const op2 = parseFloat(tabela[dimensao].intervalos[ultimo - 1].replace(",", "."))
              if (op1 <= op2) {
                erroNoIntervalo = 'fora-de-ordem'
              }
            }
          } else 
          if (index > 1 && index < ultimo) {
            const op1 = parseFloat(intervalo.replace(",", "."))
            const op2 = parseFloat(tabela[dimensao].intervalos[index - 1].replace(",", "."))
            if (op1 <= op2) {
              erroNoIntervalo = 'fora-de-ordem'
            }
          }
        }
      })  
    }
    return erroNoIntervalo 
  }

  useEffect(() => {
    const erro = erroNosIntervalos()
    const temporaryarray = Array.from(variaveis)

    if (erro) {
      temporaryarray[index].erroNaVariavel[`${dimensao}${erro}`] = true
      if (erro === 'campo-vazio') delete temporaryarray[index].erroNaVariavel[`${dimensao}fora-de-ordem`]
      if (erro === 'fora-de-ordem') delete temporaryarray[index].erroNaVariavel[`${dimensao}campo-vazio`]

      setVariaveis(temporaryarray)
    } else {
      delete temporaryarray[index].erroNaVariavel[`${dimensao}campo-vazio`]
      delete temporaryarray[index].erroNaVariavel[`${dimensao}fora-de-ordem`]
      setVariaveis(temporaryarray)
    }
  }, [tabela]) 

  const criaIntervalo = () => { 
    const tabelaTemporaria = Object.assign({}, tabela)
    const ultimo = tabela[dimensao].intervalos.length - 1
    const novoIntervalo = tabela[dimensao].intervalos[ultimo]
    tabelaTemporaria[dimensao].intervalos.push(novoIntervalo)
    setTabela(tabelaTemporaria)
  } 

  const excluiIntervalo = (i) => {
    const tabelaTemporaria = Object.assign({}, tabela)
    if (tabelaTemporaria[dimensao].intervalos.length > 3) {
      const itensCopy = Array.from(tabelaTemporaria[dimensao].intervalos)
      itensCopy.splice(i, 1)
      tabelaTemporaria[dimensao].intervalos.length = 0
      tabelaTemporaria[dimensao].intervalos = itensCopy
      setTabela(tabelaTemporaria)
    } // else, não deixa ter menos do que 2 intervalos
  } 
  
  return (
    <Fragment>
      <div key={countIntervalos}>
        <p>Preencha os <code>intervalos</code> desta variável.</p>
        <div className='permissions border mt-1'>
          <Table borderless striped responsive> 
            <thead className='thead-light'>
              <tr>
                <th>Maior ou igual a</th>
                <th>Menor que</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {tabela[dimensao].intervalos.map((intervalo, indexDoIntervalo) => {
                if (indexDoIntervalo < tabela[dimensao].intervalos.length - 1) return (
                  <tr key={indexDoIntervalo}>
                    <td>{intervalo}</td>
                    <td>                    
                      <InputNumeroNoIntervalo 
                        index={index}
                        variaveis={variaveis}
                        setVariaveis={setVariaveis}
                        indexDoIntervalo={indexDoIntervalo + 1}
                        dimensao={dimensao}
                        id={`maiorOuIgualA${index}`}
                        tabela={tabela}
                        setTabela={setTabela}  
                      />
                    </td>
                    {!(indexDoIntervalo === 0 || indexDoIntervalo === ultimoIntervalo - 1) && (tabela[dimensao].intervalos.length > 3) && <td>
                      <Button.Ripple color='flat-danger'  onClick={() => excluiIntervalo(indexDoIntervalo + 1)}>
                        <Trash size={18}/>
                      </Button.Ripple>
                    </td>}
                    {(indexDoIntervalo === ultimoIntervalo - 1) && <td>
                      <Button.Ripple color='flat-primary' onClick={() => criaIntervalo()}>
                        <Plus size={18}/>
                      </Button.Ripple>
                    </td>}
                  </tr>
                )
                else return (<><td>________</td><td>________________</td></>)
              })}
            </tbody>
          </Table> 
        </div>
        {variaveis[index].erroNaVariavel[`${dimensao}campo-vazio`] && <Alert color='danger'>Preencha ou exclua os campos da coluna 'Menor que'</Alert>}
        {variaveis[index].erroNaVariavel[`${dimensao}fora-de-ordem`] && <Alert color='danger'>Os campos devem estar com valores em ordem crescente e sem repetições</Alert>}
      </div>
    </Fragment>
  )
}

const DetalhesDaDimensao = ({ index, variaveis, setVariaveis, dimensao, tabela, setTabela }) => {
  return (
    <Fragment>
      {tabela.hasOwnProperty(dimensao) && tabela[dimensao].hasOwnProperty('id') && tabela[dimensao].id && variaveis[findVariavelById(variaveis, tabela[dimensao].id)].conteudo.tipoDaVariavel === 'NUMERO' && <ConfiguraIntervalos
        index={index}
        variaveis={variaveis}
        setVariaveis={setVariaveis}
        dimensao={dimensao}
        tabela={tabela}
        setTabela={setTabela}  
      />} 
{/*       {tabela.hasOwnProperty(dimensao) && tabela[dimensao].hasOwnProperty('id') && tabela[dimensao].id && variaveis[findVariavelById(variaveis, tabela[dimensao].id)].conteudo.tipoDaVariavel === 'SELECAO' && <div>
        <Label className='form-label' for={`dimensao2${index}`}>Esta dimensão tem estas opções:</Label>
        <ul>
          {variaveis[findVariavelById(variaveis, tabela[dimensao].id)].conteudo.opcoes.map(opcao => {
            <li>{opcao.label}</li> 
          })}
        </ul> 
      </div>} */}
      {tabela.hasOwnProperty(dimensao) && tabela[dimensao].hasOwnProperty('id') && tabela[dimensao].id && variaveis[findVariavelById(variaveis, tabela[dimensao].id)].conteudo.tipoDaVariavel === 'SIMNAO' && <div>
        <Label className='form-label' for={`dimensao2${index}`}>Esta dimensão tem estas opções:</Label>
        <ul>
          <li>Sim</li>
          <li>Não</li>
        </ul> 
      </div>}  
    </Fragment>
  )
}

const PreenchimentoDaTabela = ({ index, variaveis, tabela, setTabela }) => {
  return (
    <Row>
      <Col sm='12'>
      <div className='permissions border mt-1'>
        <Table borderless striped responsive> 
          <thead className='thead-light'>
            <tr>
              <th>{variaveis[index].name}</th>
              {tabela.dimensao1.intervalos.map((intervalo, coluna) => {
                if (coluna < tabela.dimensao1.intervalos.length - 1) return (
                  <th key={coluna}>
                    {intervalo}{' ≤ X < '}{tabela.dimensao1.intervalos[coluna + 1]}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {tabela.dimensao1.intervalos.map((intervalo, linha) => {
              if (linha < tabela.dimensao1.intervalos.length - 1) return (
                <tr key={linha}>
                  <td><b>{intervalo}{' ≤ X < '}{tabela.dimensao1.intervalos[linha + 1]}</b></td>
                  {tabela.dimensao1.intervalos.map((intervalo, coluna) => {
                    if (coluna < tabela.dimensao1.intervalos.length - 1) return (
                      <td key={coluna}>
                        <Input type='text' id='helperText' placeholder='NameNameName' />
                      </td>
                    )
                  })}
                </tr>
              )
              else return (<><td>____________________</td><td>_______________</td><td>_______________</td><td>_______________</td></>)
            })}
          </tbody>
        </Table> 
      </div>
    </Col>
  </Row>
  )
}

const ConfiguraTabela = ({ index, variaveis, setVariaveis, tabela, setTabela }) => {
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

  useEffect(() => {
    const temporaryarray = Array.from(variaveis)
    if (quantidadeDeDimensoesDaTabela === 0) {
      delete temporaryarray[index].erroNaVariavel.tabelaVazia
      temporaryarray[index].erroNaVariavel.quantidadeDeDimensoes = true
      setVariaveis(temporaryarray)
    } else {
      delete temporaryarray[index].erroNaVariavel.quantidadeDeDimensoes
      if (quantidadeDeDimensoesDaTabela > 0) temporaryarray[index].erroNaVariavel.dimensao1NaoEscolhida = true
      if (quantidadeDeDimensoesDaTabela === 2) temporaryarray[index].erroNaVariavel.dimensao2NaoEscolhida = true   
      else delete temporaryarray[index].erroNaVariavel.dimensao2NaoEscolhida
      setVariaveis(temporaryarray)
    }
  }, [quantidadeDeDimensoesDaTabela]) 

  const setQuantidadeDeDimensoes = (quantidade) => { 
    const tabelaTemporaria = Object.assign({}, tabela)

    if (!tabelaTemporaria.hasOwnProperty('dimensao1')) tabelaTemporaria.dimensao1 = { id: null }

    if (quantidade === 1) delete tabelaTemporaria.dimensao2
    else if (!tabelaTemporaria.hasOwnProperty('dimensao2')) tabelaTemporaria.dimensao2 = { id: null }   

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
      return [valorMinimo, i1, i2, valor]
    } else {
      if (valorMinimo) return [valorMinimo, null, null, null]
      if (valorMaximo) return [null, null, null, valorMaximo]
      return [null, null, null, null]
    }
  }

  const setDimensao = (dimensaoEscolhida, dimensao) => { 
    const tabelaTemporaria = Object.assign({}, tabela) 
    const temporaryarray = Array.from(variaveis)  
    tabelaTemporaria[dimensao].id = dimensaoEscolhida.id   
    if (dimensaoEscolhida.conteudo.tipoDaVariavel === 'NUMERO') {
      if (!tabelaTemporaria[dimensao].hasOwnProperty('intervalos')) tabelaTemporaria[dimensao].intervalos = montaIntervalos(dimensaoEscolhida.conteudo)
    } else delete tabelaTemporaria[dimensao].intervalos
    if (tabelaTemporaria.hasOwnProperty('dimensao2')) {
      if (tabelaTemporaria.dimensao2.id) {
        if (tabelaTemporaria.dimensao1.id === tabelaTemporaria.dimensao2.id) temporaryarray[index].erroNaVariavel.dimesaoDuplicada = true
        else delete temporaryarray[index].erroNaVariavel.dimesaoDuplicada 
      }
    }
    delete temporaryarray[index].erroNaVariavel[`${dimensao}NaoEscolhida`]
    setVariaveis(temporaryarray)
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
      {dimensoesOptions.length > 1 && <Select
        id={`quantidadeDeVariaveisDaTabela${index}`}               
        theme={selectThemeColors}
        maxMenuHeight={120}
        className='react-select'
        classNamePrefix='select'
        options={quantidadeDeVariaveisDaTabela}
        onChange={e => { setQuantidadeDeDimensoes(e.value) }}
        isClearable={false}
      />}
      {variaveis[index].erroNaVariavel.quantidadeDeDimensoes && <Alert color='danger'>Escolha a quantidade de dimensões da tabela</Alert>}

      {quantidadeDeDimensoesDaTabela > 0 && <div>
        <div className='divider'>
          <div className='divider-text'><h4>{`Dimensão 1`}</h4></div>
        </div>
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
        {variaveis[index].erroNaVariavel.dimensao1NaoEscolhida && <Alert color='danger'>Escolha a{quantidadeDeDimensoesDaTabela === 2 && ' 1ª'} dimensão</Alert>}
        <DetalhesDaDimensao
          index={index}
          variaveis={variaveis}
          setVariaveis={setVariaveis}
          dimensao='dimensao1'
          tabela={tabela}
          setTabela={setTabela}  
        />
      </div>}

      {quantidadeDeDimensoesDaTabela === 2 && <div>
        <div className='divider'>
          <div className='divider-text'><h4>{`Dimensão 2`}</h4></div>
        </div>
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
        {variaveis[index].erroNaVariavel.dimensao2NaoEscolhida && <Alert color='danger'>Escolha a 2ª dimensão</Alert>}
        {variaveis[index].erroNaVariavel.dimesaoDuplicada && <Alert color='danger'>1ª e 2ª dimensões devem ser distintas</Alert>}
        <DetalhesDaDimensao
          index={index}
          variaveis={variaveis}
          setVariaveis={setVariaveis}
          dimensao='dimensao2'
          tabela={tabela}
          setTabela={setTabela}  
        />
      </div>}
{/*       {(isObjEmpty(variaveis[index].erroNaVariavel)) && <div>
        <div className='divider'>
          <div className='divider-text'><h4>{`Conteúdo da tabela`}</h4></div>
        </div>
        <Label className='form-label' for={`dimensao2${index}`}>Preencha a tabela:</Label>      
        <PreenchimentoDaTabela
          index={index}
          variaveis={variaveis}
          tabela={tabela}
          setTabela={setTabela}  
        />
      </div>}  */}
    </Fragment>
  )
}

export default ConfiguraTabela
