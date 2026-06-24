export const navItems = [
  { label: 'Dashboard', value: 'dashboard', badge: 'live' },
  { label: 'Usuarios', value: 'users', badge: '1.2k' },
  { label: 'Medidores', value: 'meters', badge: undefined },
  { label: 'Lecturas', value: 'readings', badge: undefined },
  { label: 'Facturas', value: 'invoices', badge: '23' },
  { label: 'API Docs', value: 'api', badge: undefined },
] as const;

export const metrics = [
  {
    change: '+12%',
    label: 'Medidores Activos',
    tone: 'aqua',
    value: '1,247',
    waterLevel: 65,
  },
  {
    change: '+5%',
    label: 'Facturas Pendientes',
    tone: 'warning',
    value: '23',
    waterLevel: 42,
  },
  {
    change: '+8%',
    label: 'Recaudado Mes',
    tone: 'success',
    value: 'Bs. 45,230',
    waterLevel: 78,
  },
  {
    change: '+2',
    label: 'Morosos Críticos',
    tone: 'error',
    value: '7',
    waterLevel: 15,
  },
] as const;

export const consumptionBars = [
  { label: 'Ene', value: 48 },
  { label: 'Feb', value: 58 },
  { label: 'Mar', value: 46 },
  { label: 'Abr', value: 72 },
  { label: 'May', value: 64 },
  { label: 'Jun', value: 83 },
] as const;

export const users = [
  {
    ci: '12345678',
    email: 'juan.perez@email.com',
    meters: 2,
    name: 'Juan Perez Garcia',
    role: 'ADMIN',
    status: 'Activo',
  },
  {
    ci: '87654321',
    email: 'maria@email.com',
    meters: 1,
    name: 'Maria Lopez',
    role: 'USER',
    status: 'Activo',
  },
  {
    ci: '45678912',
    email: 'carlos@email.com',
    meters: 0,
    name: 'Carlos Ruiz',
    role: 'TECHNICAL',
    status: 'Inactivo',
  },
] as const;

export const meters = [
  {
    id: '#1001',
    label: 'Medidor Principal',
    owner: 'Juan Perez',
    progress: 45,
    reading: '45,230 m3',
    status: 'Activo',
    tone: 'aqua',
  },
  {
    id: '#1002',
    label: 'Medidor Secundario',
    owner: 'Maria Lopez',
    progress: 98,
    reading: '987,654 m3',
    status: 'Alerta',
    tone: 'warning',
  },
  {
    id: '#1003',
    label: 'Medidor Inactivo',
    owner: 'Sin asignar',
    progress: 0,
    reading: '-',
    status: 'Inactivo',
    tone: 'error',
  },
] as const;

export const invoices = [
  { amount: 'Bs. 125.00', client: 'Juan Perez', date: '2024-06-16', id: '#INV-2024-001', method: 'QR BNB', status: 'Pagado' },
  { amount: 'Bs. 127.00', client: 'Maria Lopez', date: '2024-06-15', id: '#INV-2024-002', method: '-', status: 'Pendiente' },
  { amount: 'Bs. 130.00', client: 'Carlos Ruiz', date: '2024-05-18', id: '#INV-2024-003', method: 'Transferencia', status: 'Vencido' },
] as const;

export const endpoints = [
  { auth: false, description: 'Registrar nuevo usuario', method: 'POST', path: '/auth/register', tag: 'Auth' },
  { auth: false, description: 'Iniciar sesion con Email/Password', method: 'POST', path: '/auth/login', tag: 'Auth' },
  { auth: true, description: 'Listar usuarios con filtros', method: 'GET', path: '/users', tag: 'Users' },
  { auth: true, description: 'Crear nuevo medidor', method: 'POST', path: '/water-meters', tag: 'Water' },
  { auth: true, description: 'Registrar lectura mensual', method: 'POST', path: '/readings', tag: 'Readings' },
  { auth: true, description: 'Generar factura y QR', method: 'POST', path: '/invoices', tag: 'Invoices' },
] as const;

export const apiSnippet = `POST /water-meters
Content-Type: application/json

{
  "meter_number": 1001,
  "user_id": "uuid",
  "maximum_capacity": 999999
}`;
