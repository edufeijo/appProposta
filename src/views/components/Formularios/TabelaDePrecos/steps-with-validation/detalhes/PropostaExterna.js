import * as yup from 'yup'
import { Fragment } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } from '../../../../../../configs/appProposta'
import { Form, Label, Input, FormGroup, Row, Col, FormFeedback, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import Arquivo from '../../../../UploadDeArquivo/Arquivo'

const PropostaExterna = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, operacao, stepper, type }) => {
  const SignupSchema = yup.object().shape({
    valorDaProposta: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({  
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { name, value } = e.target
    const temporaryarray = Array.from(tabelaDeItens)
    temporaryarray[0].precoDoItem = value

    if (isObjEmpty(errors)) delete temporaryarray[0].erroNoFormulario.valorDaProposta
    else temporaryarray[0].erroNoFormulario.valorDaProposta = true   

    setTabelaDeItens(temporaryarray)
  }

  return (
    <Fragment>
      <Form>
        <Row>
          <FormGroup tag={Col} md='4'>
            <Label className='form-label' for='valorDaProposta'>
              Valor da proposta
            </Label>
            <InputGroup className='input-group-merge mb-2'>
              <InputGroupAddon addonType='prepend'>
                <InputGroupText>R$</InputGroupText>
              </InputGroupAddon>
              <Input
                name='valorDaProposta'
                id='valorDaProposta'
                placeholder={"1000,00"}
                defaultValue={tabelaDeItens[0].precoDoItem}
                autoComplete="off"
                innerRef={register({ required: true })}
                invalid={errors.valorDaProposta && true}
                onChange={handleChange}
              />
              {errors && errors.valorDaProposta && <FormFeedback>Exemplos: 1244 ou 283,15</FormFeedback>}
            </InputGroup>
          </FormGroup>

          <Arquivo setVersaoDaProposta={setVersaoDaProposta} />
        </Row>
      </Form>
    </Fragment>
  )
}

export default PropostaExterna
