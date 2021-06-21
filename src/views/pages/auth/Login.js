import { useState, useContext, Fragment } from 'react'
import { useSkin } from '@hooks/useSkin'
import { Link, useHistory } from 'react-router-dom'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import * as yup from 'yup'
import classnames from 'classnames'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast, Slide } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'
import useJwt from '../../../auth/jwt/useJwt'
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
import themeConfig from '@configs/themeConfig'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
          <Avatar size='sm' color='success' content={name} initials />
        <h6 className='toast-title font-weight-bold'>Bem vindo {name}!</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Você está logado como {role} no appProposta</span>
    </div>
  </Fragment>
)

const Login = () => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()

  let msgToast = 'Email ou senha incorretos'
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true })

  const valoresIniciaisUsario = {
    emailDoUsuario: "",
    senhaDoUsuario: ""
  }

  const [usuario, setUsuario] = useState(valoresIniciaisUsario)
  
  const SignupSchema = yup.object().shape({
    emailDoUsuario: yup.string().email().required(),
    senhaDoUsuario: yup.string().required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = data => {
    trigger()
    if (isObjEmpty(errors)) {
      useJwt
        .login(usuario) 
        .then(res => {
          const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          dispatch(handleLogin(data))
          ability.update(res.data.userData.ability)
          history.push(getHomeRouteForLoggedInUser(data.role))
          toast.success(
            <ToastContent name={data.nomeDoUsuario} role={data.role} />,
            { transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        })
        .catch((err) => {
          console.log("err=", err)
          msgToast = 'Email ou senha incorretos'
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
            <Link to='/' onClick={e => e.preventDefault()}>
              <span className='brand-logo'>
                <img src={themeConfig.app.appLogoImage} alt='logo appProposta' width="49" height="47" />
                <img src={themeConfig.app.appLogoName} alt='logo appProposta' width="213" height="38" />
{/*                 <h2 className='brand-text text-primary ml-1'>{themeConfig.app.appName}</h2> */}              
              </span>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Entre em sua conta
            </CardTitle>

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
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for={`senhaDoUsuario`}>
                    Senha
                  </Label>
                  <Link to='/forgotpassword'>
                    <small>Esqueceu a senha?</small>
                  </Link>
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
              <div className='d-flex justify-content-between'>
                <Button.Ripple type='submit' color='primary' block>
                  <span >Entrar</span>
                </Button.Ripple>
              </div>
            </Form>

            <p className='text-center mt-2'>
              <span className='mr-25'>Não tem uma conta appProposta?</span>
              <Link to='/registro'>
                <span>Criar uma conta</span>
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

export default Login
