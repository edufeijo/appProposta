import { Fragment } from 'react'
import Avatar from '@components/avatar'
import { Check, X, AlertTriangle, Info } from 'react-feather'

const SuccessToast = props => {
  const { msg } = props

  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='success' icon={<Check size={12} />} />
          <h6 className='toast-title'>Successo!</h6>
        </div>
        <small className='text-muted'>Agora</small>
      </div>
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          {msg}
        </span>
      </div>
    </Fragment>)
}

const ErrorToast = props => {
  const { msg } = props

  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='danger' icon={<X size={12} />} />
          <h6 className='toast-title'>Erro!</h6>
        </div>
        <small className='text-muted'>Agora</small>
      </div>
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          {msg}
        </span>
      </div>
    </Fragment>)
}

const WarningToast = props => {
  const { msg } = props

  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='warning' icon={<AlertTriangle size={12} />} />
          <h6 className='toast-title'>Aviso!</h6>
        </div>
        <small className='text-muted'>Agora</small>
      </div>
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          {msg}
        </span>
      </div>
    </Fragment>)
}

const InfoToast = props => {
  const { msg } = props

  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='info' icon={<Info size={12} />} />
          <h6 className='toast-title'>Informação!</h6>
        </div>
        <small className='text-muted'>Agora</small>
      </div>
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          {msg}
        </span>
      </div>
    </Fragment>)
}

export { 
  SuccessToast, 
  ErrorToast, 
  WarningToast, 
  InfoToast 
}
