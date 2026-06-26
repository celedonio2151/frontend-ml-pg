import type { users } from 'modules/public/data/waterShowcaseData';

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
    forgotPassword: `${rootPaths.authRoot}/forgot-password`,
    resetPassword: `${rootPaths.authRoot}/reset-password`,
    sendVerificationEmail: `${rootPaths.authRoot}/send-verification-email`,
    verifyEmail: `${rootPaths.authRoot}/verify-email`,
  },
  admin: {
    root: `${rootPaths.pageRoot}/admin`,
    dashboard: `${rootPaths.pageRoot}/admin/dashboard`,
    users: `${rootPaths.pageRoot}/admin/users`,
    meters: `${rootPaths.pageRoot}/admin/meters`,
    readings: `${rootPaths.pageRoot}/admin/readings`,
    invoices: `${rootPaths.pageRoot}/admin/invoices`,
    apidocs: `${rootPaths.pageRoot}/admin/api-docs`,
  },

  client: {
    root: `${rootPaths.pageRoot}/client`,
    dashboard: `${rootPaths.pageRoot}/client/dashboard`,
  },
  error: {
    notFound: `${rootPaths.errorRoot}/404`,
  },
};
