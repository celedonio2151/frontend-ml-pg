import { zodResolver } from '@hookform/resolvers/zod';
import PersonAddAltRounded from '@mui/icons-material/PersonAddAltRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useSignUpMutation } from 'modules/auth/hooks/useAuthMutations';
import { signUpSchema, type SignUpFormValues } from 'modules/auth/schemas/auth.schemas';
import paths from 'router/paths';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

export default function SignUpPage() {
  const navigate = useNavigate();
  const signUpMutation = useSignUpMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      birthDate: '',
      ci: '',
      email: '',
      name: '',
      password: '',
      phoneNumber: '',
      surname: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await signUpMutation.mutateAsync({
        ...values,
        birthDate: values.birthDate?.trim() || undefined,
      });
      navigate(paths.auth.signin, {
        replace: true,
        state: { registered: true },
      });
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo crear la cuenta'));
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
        maxWidth: 520,
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
            <PersonAddAltRounded />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 950 }}>
            Crear cuenta
          </Typography>
          <Typography color="text.secondary">
            Registra un nuevo usuario para acceder al sistema administrativo.
          </Typography>
        </Stack>

        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              error={Boolean(errors.name)}
              fullWidth
              helperText={errors.name?.message}
              label="Nombre"
              {...register('name')}
            />
            <TextField
              error={Boolean(errors.surname)}
              fullWidth
              helperText={errors.surname?.message}
              label="Apellido"
              {...register('surname')}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              error={Boolean(errors.ci)}
              fullWidth
              helperText={errors.ci?.message}
              label="Cedula"
              {...register('ci')}
            />
            <TextField
              error={Boolean(errors.phoneNumber)}
              fullWidth
              helperText={errors.phoneNumber?.message}
              label="Telefono"
              {...register('phoneNumber')}
            />
          </Stack>

          <TextField
            autoComplete="email"
            error={Boolean(errors.email)}
            fullWidth
            helperText={errors.email?.message}
            label="Correo"
            type="email"
            {...register('email')}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              autoComplete="new-password"
              error={Boolean(errors.password)}
              fullWidth
              helperText={errors.password?.message}
              label="Contrasena"
              type="password"
              {...register('password')}
            />
            <TextField
              error={Boolean(errors.birthDate)}
              fullWidth
              helperText={errors.birthDate?.message}
              label="Fecha de nacimiento"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('birthDate')}
            />
          </Stack>
        </Stack>

        <Button disabled={signUpMutation.isPending} fullWidth size="large" type="submit" variant="contained">
          {signUpMutation.isPending ? 'Creando...' : 'Crear cuenta'}
        </Button>

        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center' }}>
          Ya tienes cuenta?{' '}
          <Box component={Link} to={paths.auth.signin} sx={{ color: 'primary.light', fontWeight: 800 }}>
            Iniciar sesion
          </Box>
        </Typography>
      </Stack>
    </Paper>
  );
}
