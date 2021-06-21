import { useState } from 'react'
import { useSkin } from '@hooks/useSkin'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import * as yup from 'yup'
import classnames from 'classnames'
import { isObjEmpty } from '@utils' 
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import db from '../../../db'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'
import { QTDADE_MIN_LETRAS_SENHA_DO_USUARIO, QTDADE_MAX_LETRAS_SENHA_DO_USUARIO } from '../../../configs/appProposta'

const ResetPassword = () => {
  const [skin, setSkin] = useSkin()

  const notifyError = () => toast.error(<ErrorToast msg={'Email ou senha incorretos'} />, { hideProgressBar: true })

  const valoresIniciaisUsario = {
    senhaDoUsuario: ""
  }

  const [usuario, setUsuario] = useState(valoresIniciaisUsario)
  
  const SignupSchema = yup.object().shape({
    senhaDoUsuario: yup.string().min(QTDADE_MIN_LETRAS_SENHA_DO_USUARIO).max(QTDADE_MAX_LETRAS_SENHA_DO_USUARIO).required(),
    'confirm-password-val': yup
      .string()
      .required()
      .oneOf([yup.ref(`senhaDoUsuario`), null], 'Senhas devem ser iguais')
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
////////////////////////////////////////////////////
      db.createEmpresa(usuario)       // chama API para alterar a senha. Ver como autenticar o link
      .then((empresaIncluida) => {
      })
      .catch((err) => {
        notifyError()
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
              Escolha sua nova senha
            </CardTitle>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for={`senhaDoUsuario`}>
                    Nova senha
                  </Label>
                </div>
                <Input
                  type='password'
                  name={`senhaDoUsuario`}
                  id={`senhaDoUsuario`}
                  innerRef={register({ required: true })}
                  className={classnames({ 'is-invalid': errors[`senhaDoUsuario`] })}
                  onChange={handleChangeUsuario}
                  placeholder='********'
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for={`senhaDoUsuario`}>
                    Confirme a nova senha
                  </Label>
                </div>
                <Input
                  type='password'
                  name='confirm-password-val'
                  id='confirm-password-val'
                  innerRef={register({ required: true })}
                  className={classnames({ 'is-invalid': errors['confirm-password-val'] })}
                  placeholder='********'
                />
              </FormGroup>
              <div className='d-flex justify-content-between'>
                <Button.Ripple type='submit' color='primary' className='btn-next' block>
                  <span>Alterar senha</span>
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

export default ResetPassword

