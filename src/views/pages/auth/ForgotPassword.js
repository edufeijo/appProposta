import { useState } from 'react'
import { useSkin } from '@hooks/useSkin'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col, CardText } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import * as yup from 'yup'
import classnames from 'classnames'
import { isObjEmpty } from '@utils' 
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import db from '../../../db'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'
import { ChevronLeft } from 'react-feather'

const ForgotPassword = () => {
  const [skin, setSkin] = useSkin()

  const notifyError = () => toast.error(<ErrorToast msg={'Email ou senha incorretos'} />, { hideProgressBar: true })

  const valoresIniciaisUsario = {
    emailDoUsuario: ""
  }

  const [usuario, setUsuario] = useState(valoresIniciaisUsario)
  
  const SignupSchema = yup.object().shape({
    emailDoUsuario: yup.string().email().required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
////////////////////////////////////////////////////
      db.createEmpresa(usuario)       // chama API que verifica o email do usuário e gera link para redefinir senha
      .then((empresaIncluida) => {
      })
      .catch((err) => {
        notifyError() // Notificar sucesso após chamar a API. Não dá msg de erro
      }) 
    }
  }

  const handleChangeUsuario = e => {
    const { name, value } = e.target
    setUsuario(usuarioAnterior => ({...usuarioAnterior, [name]: value}))
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <h2 className='brand-text text-primary ml-1'>appProposta</h2>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Esqueceu sua senha?
            </CardTitle>
            <CardText className='mb-2'>Digite seu email e nós enviaremos as instruções para redefinir sua senha</CardText>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <FormGroup tag={Col} md='12'>
                  <Label className='form-label' for={`emailDoUsuario`}>
                    Email
                  </Label>
                  <Input
                    type='email'
                    name={`emailDoUsuario`}
                    id={`emailDoUsuario`}
                    innerRef={register({ required: true })}
                    className={classnames({ 'is-invalid': errors[`emailDoUsuario`] })}
                    onChange={handleChangeUsuario}
                  />
                </FormGroup>
              </Row>

              <div className='d-flex justify-content-between'>
                <Button.Ripple type='submit' color='primary' className='btn-next' block>
                  <span>Redefinir senha</span>
                </Button.Ripple>
              </div>
            </Form>

            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>Voltar</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword

