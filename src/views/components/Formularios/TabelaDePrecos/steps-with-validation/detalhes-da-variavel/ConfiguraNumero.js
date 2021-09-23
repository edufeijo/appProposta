import { Fragment } from 'react'
import { Row, Col, Label, InputGroup, Input, FormGroup, FormFeedback } from 'reactstrap'
import { isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } from '../../../../../../configs/appProposta'

const InputNumero = ({ index, labelDoNumero, propriedadeDoNumero, variaveis, setVariaveis }) => { 
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
    <div>
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
  return (
    <Fragment>
      <Row>
        <FormGroup tag={Col} md='6' sd='6'>
          <InputNumero 
            index={index}
            id={`inputMinimo${index}`}
            labelDoNumero={`${variaveis[index].label} (valor mínimo)`}
            propriedadeDoNumero={'valorMinimo'}
            setVariaveis={setVariaveis}  
            variaveis={variaveis}
          />
        </FormGroup>
        <FormGroup tag={Col} md='6' sd='6'>
          <InputNumero 
            index={index}
            id={`inputMaximo${index}`}
            labelDoNumero={`${variaveis[index].label} (valor máximo)`}
            propriedadeDoNumero={'valorMaximo'}
            setVariaveis={setVariaveis}  
            variaveis={variaveis}
          />
        </FormGroup>
      </Row>
    </Fragment>
  )
}

export default ConfiguraNumero
