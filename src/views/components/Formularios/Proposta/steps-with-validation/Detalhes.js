import * as yup from 'yup'
import { Fragment, useState, useEffect } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { DIAS_MAX_VALIDADE_DA_PROPOSTA, QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } from '../../../../../configs/appProposta'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, InputGroup, InputGroupAddon, InputGroupText  } from 'reactstrap'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Arquivo from '../../../UploadDeArquivo/Arquivo'

const Detalhes = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao, stepper, type }) => {
  const [picker, setPicker] = useState(new Date())

  const SignupSchema = yup.object().shape({
    valorDaProposta: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required(),
    diasDeValidadeDaProposta: yup.number().positive().integer().max(DIAS_MAX_VALIDADE_DA_PROPOSTA)
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
    if (name !== 'valorDaProposta') {
      setVersaoDaProposta(registroAnterior => ({
        ...registroAnterior, 
        [name]: value
      }))  
    } else {
      setVersaoDaProposta(registroAnterior => ({
        ...registroAnterior, 
        valorDaProposta: parseFloat(value.replace(",", "."))
      }))
    }
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

          <FormGroup tag={Col} md='4'>
            <Label className='form-label' for='dataDaProposta'>
              Data de emissão da proposta
            </Label>
            <Flatpickr
              value={picker}
              name='dataDaProposta'
              id='dataDaProposta'
              className='form-control'
              onChange={date => {
                setPicker(date)  
                setVersaoDaProposta(registroAnterior => ({
                  ...registroAnterior, 
                  dataDaProposta: moment(date[0]).local().format()
                }))
              }
              }
              placeholder={moment(picker).format('DD/MM/YYYY')}
              options={{
                altInput: true,
                altFormat: 'd/m/Y',
                dateFormat: 'd-m-Y',
                maxDate: 'today',
                minDate: '01.01.2021',
                locale: Portuguese
              }}
            />
            {errors && errors.dataDaProposta && <FormFeedback>Data inválida</FormFeedback>}
          </FormGroup> 

          {empresa && <FormGroup tag={Col} md='4'>
            <Label className='form-label' for='diasDeValidadeDaProposta'>
              Proposta válida por
            </Label>
            <InputGroup className='input-group-merge mb-2'>
              <Input
                name='diasDeValidadeDaProposta'
                id='diasDeValidadeDaProposta'
                defaultValue={empresa.config.diasDeValidadeDaProposta}
                autoComplete="off"
                innerRef={register({ required: true })}
                invalid={errors.diasDeValidadeDaProposta && true}
                onChange={handleChange}
              />
              <InputGroupAddon addonType='append'>
                <InputGroupText>dias</InputGroupText>
              </InputGroupAddon>
              {errors && errors.diasDeValidadeDaProposta && <FormFeedback>Deve ser um número maior que zero e menor que {DIAS_MAX_VALIDADE_DA_PROPOSTA}</FormFeedback>}
            </InputGroup>
          </FormGroup>}

          <Arquivo setVersaoDaProposta={setVersaoDaProposta} />

        </Row>
        <div className='d-flex justify-content-between'>
          <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
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

export default Detalhes
