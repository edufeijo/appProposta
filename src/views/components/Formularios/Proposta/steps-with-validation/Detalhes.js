import * as yup from 'yup'
import { Fragment, useState, useEffect } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, X, Plus } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } from '../../../../../configs/appProposta'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, InputGroup, InputGroupAddon, InputGroupText, Card, CardHeader, CardBody, CardText } from 'reactstrap'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import PropostaExterna from './detalhes/PropostaExterna'
import LinhaALinha from './detalhes/LinhaALinha'

const Detalhes = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao, stepper, type }) => {
  return (
    <Fragment>
      {proposta && proposta.propostaCriadaPor === 'Linha a linha' && <LinhaALinha 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />}
      {proposta && proposta.propostaCriadaPor === 'Documento externo' && <PropostaExterna 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />}
    </Fragment>
  )
}

export default Detalhes
