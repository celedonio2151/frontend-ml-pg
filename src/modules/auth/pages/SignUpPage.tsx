import { zodResolver } from '@hookform/resolvers/zod';

// MUI ICONS
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import EmailRounded from '@mui/icons-material/EmailRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import PersonAddAltRounded from '@mui/icons-material/PersonAddAltRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PhoneRounded from '@mui/icons-material/PhoneRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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
  const [showPassword, setShowPassword] = useState(false);

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
              required
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded fontSize="medium" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('name')}
            />
            <TextField
              error={Boolean(errors.surname)}
              fullWidth
              helperText={errors.surname?.message}
              label="Apellido"
              required
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded fontSize="medium" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('surname')}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              error={Boolean(errors.ci)}
              fullWidth
              helperText={errors.ci?.message}
              label="Carnet de identidad"
              required
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactEmergencyRoundedIcon fontSize="medium" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('ci')}
            />
            <TextField
              error={Boolean(errors.phoneNumber)}
              fullWidth
              helperText={errors.phoneNumber?.message}
              label="Telefono"
              required
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneRounded fontSize="medium" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('phoneNumber')}
            />
          </Stack>

          <TextField
            autoComplete="email"
            error={Boolean(errors.email)}
            fullWidth
            helperText={errors.email?.message}
            label="Correo"
            required
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded fontSize="medium" />
                  </InputAdornment>
                ),
              },
            }}
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
              required
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded fontSize="medium" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                        edge="end"
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <TextField
              error={Boolean(errors.birthDate)}
              fullWidth
              helperText={errors.birthDate?.message}
              label="Fecha de nacimiento"
              required
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthRounded fontSize="medium" />
                    </InputAdornment>
                  ),
                },
                inputLabel: { shrink: true },
              }}
              type="date"
              {...register('birthDate')}
            />
          </Stack>
        </Stack>

        <Button
          disabled={signUpMutation.isPending}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {signUpMutation.isPending ? 'Creando...' : 'Crear cuenta'}
        </Button>

        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center' }}>
          Ya tienes cuenta?{' '}
          <Box
            component={Link}
            to={paths.auth.signin}
            sx={{ color: 'primary.light', fontWeight: 800 }}
          >
            Iniciar sesion
          </Box>
        </Typography>
      </Stack>
    </Paper>
  );
}
