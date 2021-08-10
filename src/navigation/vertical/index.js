import { Activity, FileText, List, Users, DollarSign, Award, Bookmark, CheckCircle } from 'react-feather'

export default [
  {
    id: 'painel-master',
    title: 'Controle MASTER',
    icon: <Activity size={20} />,
    action: 'manage',
    resource: 'master',
    navLink: '/home-master'
  },
  {
    id: 'painel',
    title: 'Painel de Controle',
    icon: <Activity size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '/home'
  },
  {
    header: 'Propostas',
    action: 'manage',
    resource: 'empresa'
  },
  {
    id: 'propostas',
    title: 'Propostas',
    icon: <FileText size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '/proposta/list'
  },  
  {
    id: 'contratos',
    title: 'Contratos',
    icon: <List size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '#'
  },
  {
    id: 'clientes',
    title: 'Clientes',
    icon: <Users size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '/clientes'
  },
  {
    id: 'precos',
    title: 'Preços',
    icon: <DollarSign size={20} />, 
    action: 'manage',
    resource: 'empresa',
    navLink: '/precos/list'
  }, 
  {
    header: 'Posso Te Indicar!',
    action: 'manage',
    resource: 'empresa'
  },
  {
    id: 'convites',
    title: 'Convites',
    icon: <Bookmark size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '#'
  },
  {
    id: 'indicacoes',
    title: 'Indicações',
    icon: <CheckCircle size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '#'
  },
  {
    id: 'recompensas',
    title: 'Recompensas',
    icon: <Award size={20} />,
    action: 'manage',
    resource: 'empresa',
    navLink: '#',
    badge: 'light-danger',
    badgeText: '4'
  }
]
