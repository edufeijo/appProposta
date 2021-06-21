import { Fragment, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Upload } from 'react-feather'
import { Button, Card, CardBody, CustomInput } from 'reactstrap'
import { useFilePicker } from 'use-file-picker'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../Toasts/ToastTypes'
import { TAMANHO_MAX_ARQUIVO_DA_PROPOSTA } from '../../../configs/appProposta'

const Arquivo = ({ setVersaoDaProposta }) => {
  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const [openFileSelector, { filesContent, loading, errors, plainFiles, clear }] = useFilePicker({
    multiple: false,
    readAs: 'DataURL', 
    // accept: ['.pdf'],
    limitFilesConfig: { min: 1, max: 1 },
    // minFileSize: 1, 
    maxFileSize: TAMANHO_MAX_ARQUIVO_DA_PROPOSTA 
  })

  if (errors.length) {
    if (errors[0].fileSizeToolarge) msgToast = `O tamanho do arquivo não pode ultrapassar ${TAMANHO_MAX_ARQUIVO_DA_PROPOSTA} MB`
    else msgToast =  'Erro ao ler o arquivo'
    notifyError()
    errors.length = 0
  } 

  useEffect(() => {
    if (filesContent.length) {
      setVersaoDaProposta(registroAnterior => ({
        ...registroAnterior, 
        arquivoDaProposta: filesContent[0]
      }))
    } else {
      setVersaoDaProposta(registroAnterior => ({
        ...registroAnterior, 
        arquivoDaProposta: null
      }))
    }
  }, [filesContent.length])

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div align="center">
            {!filesContent.length && <h4>Selecione o arquivo da proposta (opcional)</h4>}
            {!filesContent.length && <Button.Ripple color='primary' onClick={() => openFileSelector()}>
              <Upload size={14} className='align-middle mr-sm-25 mr-0' />
              <span className='align-middle d-sm-inline-block d-none'>Selecione</span>
            </Button.Ripple>}
            {!filesContent.length && <p>Tamanho máximo de {TAMANHO_MAX_ARQUIVO_DA_PROPOSTA} MB</p>}

            {filesContent.length ? <h4>Arquivo selecionado:</h4> : ''}
            {filesContent.length ? <CustomInput
              type='checkbox'
              className='custom-control-success'
              id='success'
              label={filesContent[0].name}
              defaultChecked
              inline
              onClick={() => clear()}
            /> : ''}
          </div>
        </CardBody>
      </Card>
{/*       <div className='d-flex justify-content-between'>
        <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
        </Button.Ripple>
        <Button.Ripple color='primary' className='btn-next' onClick={() => stepper.next()}>
          <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
          <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
        </Button.Ripple>
      </div> */}
    </Fragment>
  )
}

export default Arquivo
