// ** Core JWT Import
import useJwt from '@src/@core/auth/jwt/useJwt'
import config from '../../configs/urlAppProposta'

const { jwt } = useJwt({
    loginEndpoint: `${config.URL_APPPROPOSTA}/login`,
    registerEndpoint: '',
    refreshEndpoint: `${config.URL_APPPROPOSTA}/refresh-token`,
    logoutEndpoint: `${config.URL_APPPROPOSTA}/logout`
})

export default jwt