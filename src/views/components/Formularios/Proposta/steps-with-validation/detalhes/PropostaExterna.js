import * as yup from 'yup'
import { Fragment } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } from '../../../../../../configs/appProposta'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import Arquivo from '../../../../UploadDeArquivo/Arquivo'

const PropostaExterna = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, operacao, stepper, type }) => {
  const SignupSchema = yup.object().shape({
    valorDaProposta: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
      stepper.next()
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setVersaoDaProposta(registroAnterior => ({
      ...registroAnterior, 
      [name]: value
    }))  
  }

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
                defaultValue={versaoDaProposta.valorDaProposta}
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

        <div className='d-flex justify-content-between'>
          <Button.Ripple 
            color='primary' 
            className='btn-prev' 
            onClick={() => setProposta(registroAnterior => ({...registroAnterior, propostaCriadaPor: "Linha a linha"}))}
          >
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button.Ripple>
          <Button.Ripple type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  )
}

export default PropostaExterna
