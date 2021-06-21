import { Fragment, useState } from 'react'
import { useSkin } from '@hooks/useSkin'
import { Link, useHistory } from 'react-router-dom'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, CustomInput, Button, Row, Col } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import * as yup from 'yup'
import classnames from 'classnames'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import db from '../../../db'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'
import { QTDADE_MIN_LETRAS_NOME_DO_USUARIO, QTDADE_MIN_LETRAS_EMAIL_DO_USUARIO, QTDADE_MIN_LETRAS_SENHA_DO_USUARIO, QTDADE_MIN_LETRAS_NOME_DA_EMPRESA, QTDADE_MAX_LETRAS_NOME_DO_USUARIO, QTDADE_MAX_LETRAS_EMAIL_DO_USUARIO, QTDADE_MAX_LETRAS_SENHA_DO_USUARIO, QTDADE_MAX_LETRAS_NOME_DA_EMPRESA } from '../../../configs/appProposta'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import themeConfig from '@configs/themeConfig'

const Register = () => {
  const history = useHistory()
  const [skin, setSkin] = useSkin()

  const RememberMe = () => {
    return (
      <Fragment>
        Eu concordo com a
        <a className='ml-25' href='/' onClick={e => e.preventDefault()}>
          política de privacidade
        </a> e os
        <a className='ml-25' href='/' onClick={e => e.preventDefault()}>
          termos de uso
        </a>
      </Fragment>
    )
  }

  const MySwal = withReactContent(Swal)
  const alertaDeSucesso = (titulo, texto, url) => {
    return MySwal.fire({
      title: titulo,
      text: texto,
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        history.push(url)
      }
    })
  }

  let msgErro = 'Não foi possível registrar a Empresa. Verifique sua conexão e tente novamente mais tarde'
  const notifyError = () => toast.error(<ErrorToast msg={msgErro} />, { hideProgressBar: true })
  
  const valoresIniciaisEmpresa = {
    nomeDaEmpresa: "",
    dataDeRegistroDaEmpresa: "",
    statusDaEmpresa: 'ativa'
  }  

  const valoresIniciaisUsario = {
    nomeDoUsuario: "",
    sobrenomeDoUsuario: "",
    emailDoUsuario: "",
    senhaDoUsuario: "",
    dataDeRegistroDoUsuario: "",
    statusDoUsuario: "ativo",
    criadorDaEmpresa: false,
    nomeDaEmpresa: "",
    role: null,
    ability: [{ action : "manage", subject : "empresa"}],
    idDaEmpresa: null
  }

  const [registro, setRegistro] = useState(valoresIniciaisEmpresa)
  const [usuario, setUsuario] = useState(valoresIniciaisUsario)
  
  const SignupSchema = yup.object().shape({
    nomeDoUsuario: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_USUARIO).max(QTDADE_MAX_LETRAS_NOME_DO_USUARIO).required(),
    emailDoUsuario: yup.string().email().min(QTDADE_MIN_LETRAS_EMAIL_DO_USUARIO).max(QTDADE_MAX_LETRAS_EMAIL_DO_USUARIO).required(),
    nomeDaEmpresa: yup.string().min(QTDADE_MIN_LETRAS_NOME_DA_EMPRESA).max(QTDADE_MAX_LETRAS_NOME_DA_EMPRESA).required(),
    senhaDoUsuario: yup.string().min(QTDADE_MIN_LETRAS_SENHA_DO_USUARIO).max(QTDADE_MAX_LETRAS_SENHA_DO_USUARIO).required(),
    'confirm-password-val': yup
      .string()
      .required()
      .oneOf([yup.ref(`senhaDoUsuario`), null], 'Senhas devem ser iguais')
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
      const registroCompleto = registro
      registroCompleto.dataDeRegistroDaEmpresa = moment().local().format()
      db.createEmpresa(registroCompleto)
      .then((empresaIncluida) => {
        const usuarioCompleto = usuario
        usuarioCompleto.dataDeRegistroDoUsuario = moment().local().format()
        usuarioCompleto.criadorDaEmpresa = true
        usuarioCompleto.nomeDaEmpresa = empresaIncluida.nomeDaEmpresa
        usuarioCompleto.idDaEmpresa = empresaIncluida._id
        usuarioCompleto.role = 'admin'
        db.createUsuario(usuarioCompleto) 
        .then((usuarioIncluido) => {
          alertaDeSucesso("Parabéns!", "Seu negócio foi registrado com sucesso.", getHomeRouteForLoggedInUser(usuarioCompleto.role))
        })
        .catch((err) => {
          const str = String(err)
          if (str.match(/409/)) msgErro = 'Usuário com este email já está cadastrado. Permitida somente uma Empresa por email' 
          notifyError()
        }) 
      })
      .catch((err) => {
        console.log("err=", err)
        msgErro = 'Não foi possível registrar a Empresa. Verifique sua conexão e tente novamente mais tarde'
        notifyError()
      }) 
    }
  }

  const handleChangeUsuario = e => {
    const { name, value } = e.target
    setUsuario(usuarioAnterior => ({...usuarioAnterior, [name]: value}))
  }

  const handleChangeEmpresa = e => {
    const { name, value } = e.target
    setRegistro(registroAnterior => ({...registroAnterior, [name]: value}))
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <span className='brand-logo'>
                <img src={themeConfig.app.appLogoImage} alt='logo appProposta' width="49" height="47" />
                <img src={themeConfig.app.appLogoName} alt='logo appProposta' width="213" height="38" />
{/*                 <h2 className='brand-text text-primary ml-1'>{themeConfig.app.appName}</h2> */}              
              </span>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Crie sua conta e inove em seu Negócio!
            </CardTitle>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <FormGroup tag={Col} md='12'>
                  <Label className='form-label' for={`nomeDoUsuario`}>
                    Seu nome
                  </Label>
                  <Input
                    name={`nomeDoUsuario`}
                    id={`nomeDoUsuario`}
                    placeholder='João'
                    innerRef={register({ required: true })}
                    className={classnames({ 'is-invalid': errors[`nomeDoUsuario`] })}
                    onChange={handleChangeUsuario}
                    invalid={errors.nomeDoUsuario && true}
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup tag={Col} md='12'>
                  <Label className='form-label' for={`emailDoUsuario`}>
                    Seu email
                  </Label>
                  <Input
                    type='email'
                    name={`emailDoUsuario`}
                    id={`emailDoUsuario`}
                    placeholder='joao.oliveira@email.com'
                    innerRef={register({ required: true })}
                    className={classnames({ 'is-invalid': errors[`emailDoUsuario`] })}
                    onChange={handleChangeUsuario}
                  />
                </FormGroup>
                <FormGroup tag={Col} md='12'>
                  <Label className='form-label' for={`nomeDaEmpresa`}>
                    Nome do seu negócio
                  </Label>
                  <Input
                    name={`nomeDaEmpresa`}
                    id={`nomeDaEmpresa`}
                    placeholder='Meu Negócio'
                    innerRef={register({ required: true })}
                    className={classnames({ 'is-invalid': errors[`nomeDaEmpresa`] })}
                    onChange={handleChangeEmpresa}
                  />
                </FormGroup>
              </Row>
              <Row>
                <div className='form-group form-password-toggle col-md-6'>
                  <Label className='form-label' for={`senhaDoUsuario`}>
                    Crie uma senha
                  </Label>
                  <Input
                    type='password'
                    name={`senhaDoUsuario`}
                    id={`senhaDoUsuario`}
                    innerRef={register({ required: true })}
                    className={classnames({ 'is-invalid': errors[`senhaDoUsuario`] })}
                    onChange={handleChangeUsuario}
                    placeholder='********'
                  />
                </div>
                <div className='form-group form-password-toggle col-md-6'>
                  <Label className='form-label' for='confirm-password-val'>
                    Confirme a senha
                  </Label>
                  <Input
                    type='password'
                    name='confirm-password-val'
                    id='confirm-password-val'
                    innerRef={register({ required: true })}
                    className={classnames({ 'is-invalid': errors['confirm-password-val'] })}
                    placeholder='********'
                  />
                </div>
              </Row>
              <FormGroup>
                <CustomInput
                  type='checkbox'
                  className='custom-control-Primary'
                  id='remember-me'
                  label={<RememberMe />}
                />
              </FormGroup>
              <div className='d-flex justify-content-between'>
                <Button.Ripple type='submit' color='primary' className='btn-next' block>
                  <span>Registrar</span>
                </Button.Ripple>
              </div>
            </Form>

            <p className='text-center mt-2'>
              <span className='mr-25'>Já tem uma conta?</span>
              <Link to='/login'>
                <span>Entrar</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button.Ripple color='facebook'>
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color='twitter'>
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color='google'>
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className='mr-0' color='github'>
                <GitHub size={14} />
              </Button.Ripple>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Register
