import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - appProposta'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/pages/Home')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  },   
  {
    path: '/proposta/list',
    component: lazy(() => import('../../views/pages/propostas')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/proposta/new',
    component: lazy(() => import('../../views/pages/propostas/EditaProposta')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/proposta/edit/:id',
    component: lazy(() => import('../../views/pages/propostas/EditaProposta')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/proposta/review/:rascunho',
    component: lazy(() => import('../../views/pages/propostas/EditaProposta')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/proposta/preview/:id',
    component: lazy(() => import('../../views/pages/propostas/MostraProposta')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/clientes',
    component: lazy(() => import('../../views/pages/clientes')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/cliente/preview/:id',
    component: lazy(() => import('../../views/pages/clientes/MostraCliente')),
    meta: {
      action: 'manage',
      resource: 'empresa'
    }
  }, 
  {
    path: '/home-master',
    component: lazy(() => import('../../views/pages/HomeMaster')),
    meta: {
      action: 'manage',
      resource: 'master'
    }
  },
  {
    path: '/registro',
    component: lazy(() => import('../../views/pages/auth/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/auth/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/forgotpassword',
    component: lazy(() => import('../../views/pages/auth/ForgotPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/resetpassword',
    component: lazy(() => import('../../views/pages/auth/ResetPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/pages/misc/Error')),
    layout: 'BlankLayout'
  },
  {
    path: '/misc/not-authorized',
    component: lazy(() => import('../../views/pages/misc/NotAuthorized')),
    layout: 'BlankLayout',
        meta: {
      publicRoute: true
    }
  }
]

export { DefaultRoute, TemplateTitle, Routes }
