import { zodResolver } from '@hookform/resolvers/zod';
import LockRounded from '@mui/icons-material/LockRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { useSignInMutation } from 'modules/auth/hooks/useAuthMutations';
import { signInSchema, type SignInFormValues } from 'modules/auth/schemas/auth.schemas';
import paths from 'router/paths';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type AuthLocationState = {
  from?: {
    pathname?: string;
  };
};

export default function SingInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signInMutation = useSignInMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const locationState = location.state as (AuthLocationState & { registered?: boolean }) | null;
  const from = locationState?.from?.pathname ?? paths.admin.dashboard;
  const registered = Boolean(locationState?.registered);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await signInMutation.mutateAsync(values);
      navigate(from, { replace: true });
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo iniciar sesion'));
      }
    }
  });

  return (
    <Paper
      component="form"
      elevation={0}
      onSubmit={onSubmit}
      sx={{
        width: 1,
        maxWidth: 440,
        mx: 'auto',
        p: { xs: 2.5, sm: 4 },
        borderRadius: 2,
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === 'dark' ? 'rgba(34, 211, 238, 0.28)' : 'rgba(2, 132, 199, 0.18)'
          }`,
        background: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.76)' : 'rgba(255, 255, 255, 0.84)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color: 'primary.contrastText',
              bgcolor: 'primary.main',
            }}
          >
            <LockRounded />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 950 }}>
            Iniciar sesion
          </Typography>
          <Typography color="text.secondary">
            Entra al panel para gestionar usuarios, medidores y operaciones.
          </Typography>
        </Stack>

        {registered ? <Alert severity="success">Cuenta creada. Ya puedes iniciar sesion.</Alert> : null}
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <Stack spacing={2}>
          <TextField
            autoComplete="email"
            error={Boolean(errors.email)}
            fullWidth
            helperText={errors.email?.message}
            label="Correo"
            type="email"
            {...register('email')}
          />
          <TextField
            autoComplete="current-password"
            error={Boolean(errors.password)}
            fullWidth
            helperText={errors.password?.message}
            label="Contrasena"
            type="password"
            {...register('password')}
          />
        </Stack>

        <Button disabled={signInMutation.isPending} fullWidth size="large" type="submit" variant="contained">
          {signInMutation.isPending ? 'Entrando...' : 'Entrar'}
        </Button>

        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center' }}>
          No tienes cuenta?{' '}
          <Box component={Link} to={paths.auth.signup} sx={{ color: 'primary.light', fontWeight: 800 }}>
            Crear cuenta
          </Box>
        </Typography>
      </Stack>
    </Paper>
  );
}
