// ** Icons Import
import { Heart } from 'react-feather'

const FooterAppProposta = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='http://www.edufeijo.com.br' target='_blank' rel='noopener noreferrer'>
          web321
        </a>
      </span>
      <span className='float-md-right d-none d-md-block'>
        Feito com 
        <Heart size={14} />
      </span>
    </p>
  )
}

export default FooterAppProposta
