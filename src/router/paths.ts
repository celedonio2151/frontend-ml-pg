export const rootPaths = {
  root: '/',
  pageRoot: '/pages',
  authRoot: '/auth',
  errorRoot: '/error',
};

export default {
  auth: {
    signin: `${rootPaths.authRoot}/signin`,
    signup: `${rootPaths.authRoot}/signup`,
    register: `${rootPaths.authRoot}/register`,
    forgotPassword: `${rootPaths.authRoot}/forgot-password`,
    resetPassword: `${rootPaths.authRoot}/reset-password`,
    sendVerificationEmail: `${rootPaths.authRoot}/send-verification-email`,
    verifyEmail: `${rootPaths.authRoot}/verify-email`,
  },
  admin: {
    root: `${rootPaths.pageRoot}/admin`,
    dashboard: `${rootPaths.pageRoot}/admin/dashboard`,
    products: `${rootPaths.pageRoot}/admin/products`,
    enrollments: `${rootPaths.pageRoot}/admin/enrollments`,
    roles: `${rootPaths.pageRoot}/admin/roles`,
    branches: `${rootPaths.pageRoot}/admin/branches`,
    users: `${rootPaths.pageRoot}/admin/users`,
    settings: `${rootPaths.pageRoot}/admin/settings`,
    orders: `${rootPaths.pageRoot}/admin/orders`,
    studyCenters: `${rootPaths.pageRoot}/admin/study-centers`,
  },

  client: {
    root: `${rootPaths.pageRoot}/client`,
    dashboard: `${rootPaths.pageRoot}/client/dashboard`,
    completeProfile: `${rootPaths.pageRoot}/client/complete-profile`,
    waitingApproval: `${rootPaths.pageRoot}/client/waiting-approval`,
    welcome: `${rootPaths.pageRoot}/client/welcome`,
    branch: `${rootPaths.pageRoot}/client/branch/:id`,
    orders: `${rootPaths.pageRoot}/client/orders`,
    product: `${rootPaths.pageRoot}/client/product`, // Base path
    productDetail: `${rootPaths.pageRoot}/client/product/:id`, // Dynamic path
    checkout: `${rootPaths.pageRoot}/client/checkout`,
    paymentPending: `${rootPaths.pageRoot}/client/payment-pending`,
    paymentDetail: `${rootPaths.pageRoot}/client/payment-detail`,
    profile: `${rootPaths.pageRoot}/client/profile`,
  },
  error: {
    notFound: `${rootPaths.errorRoot}/404`,
  },
};
