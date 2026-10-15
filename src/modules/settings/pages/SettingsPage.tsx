import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import AppsRounded from '@mui/icons-material/AppsRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import PriceChangeRounded from '@mui/icons-material/PriceChangeRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import SearchOffRounded from '@mui/icons-material/SearchOffRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { useAuthStore } from 'modules/auth/stores/auth.store';
import SettingCard from 'modules/settings/components/SettingCard';
import { useSettings, useUpdateSettingMutation } from 'modules/settings/hooks/useSettings';
import { CATEGORY_META, FALLBACK_SECTION, getSettingMeta } from 'modules/settings/settings.meta';
import {
  SettingCategory,
  type Setting,
  type SettingCategoryType,
} from 'modules/settings/types/setting.types';
import { validateSettingValue } from 'modules/settings/utils/validateSetting';
import paths from 'router/paths';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import { getAquaTone, type AquaTone } from 'shared/ui/aqua/aquaTones';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type CategoryFilter = 'ALL' | SettingCategoryType;

function groupBySection(items: Setting[]) {
  const sections = new Map<string, Setting[]>();
  items.forEach((setting) => {
    const section = getSettingMeta(setting.settingKey).section;
    sections.set(section, [...(sections.get(section) ?? []), setting]);
  });
  // "Otros" (claves no documentadas) siempre al final.
  return [...sections.entries()].sort(
    ([a], [b]) => Number(a === FALLBACK_SECTION) - Number(b === FALLBACK_SECTION),
  );
}

function CategoryFilterCard({
  active,
  count,
  description,
  icon,
  label,
  onClick,
  tone,
}: {
  active: boolean;
  count: number;
  description: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone: AquaTone;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={(theme) => {
        const t = getAquaTone(theme, tone);
        return {
          p: 2,
          gap: 1.5,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'left',
          borderRadius: 3,
          border: '1px solid',
          borderColor: active ? t.accent : 'divider',
          bgcolor: active ? t.surface : alpha(theme.palette.background.paper, 0.4),
          boxShadow: active ? `0 10px 28px ${alpha(t.accent, 0.18)}` : 'none',
          transition: 'all 180ms ease',
          '&:hover': { borderColor: t.border, transform: 'translateY(-2px)' },
        };
      }}
    >
      <Box
        sx={(theme) => {
          const t = getAquaTone(theme, tone);
          return {
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color: active ? theme.palette.background.paper : t.accent,
            bgcolor: active ? t.accent : t.surface,
            transition: 'all 180ms ease',
          };
        }}
      >
        {icon}
      </Box>
      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.secondary' }}>
            {count}
          </Typography>
        </Stack>
        <Typography noWrap variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}

export default function SettingsPage() {
  const settingsQuery = useSettings();
  const updateMutation = useUpdateSettingMutation();

  const [filter, setFilter] = useState<CategoryFilter>('ALL');
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // PATCH /settings/{key} es solo para ADMIN; el resto de roles solo puede ver.
  const isAdmin = useAuthStore(
    (state) => state.user?.roles?.some((role) => role.name.toUpperCase() === 'ADMIN') ?? false,
  );

  const settings = useMemo(() => settingsQuery.data?.items ?? [], [settingsQuery.data]);
  const settingsByKey = useMemo(() => new Map(settings.map((s) => [s.settingKey, s])), [settings]);

  const dirtyKeys = useMemo(
    () =>
      Object.keys(drafts).filter((key) => {
        const setting = settingsByKey.get(key);
        return setting && drafts[key] !== setting.value;
      }),
    [drafts, settingsByKey],
  );
  const hasInvalid = dirtyKeys.some((key) => {
    const setting = settingsByKey.get(key);
    return setting ? Boolean(validateSettingValue(setting, drafts[key])) : false;
  });

  // Avisa al cerrar/recargar la pestaña si hay cambios sin guardar.
  useEffect(() => {
    if (dirtyKeys.length === 0) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirtyKeys.length]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: settings.length };
    settings.forEach((s) => (result[s.category] = (result[s.category] ?? 0) + 1));
    return result;
  }, [settings]);

  // La lista es corta y no paginada: se trae una vez y se filtra en cliente.
  const visibleGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = settings.filter((s) => {
      if (filter !== 'ALL' && s.category !== filter) return false;
      if (!term) return true;
      const meta = getSettingMeta(s.settingKey);
      return [s.settingKey, s.value, s.description, meta.label, meta.section].some((text) =>
        text.toLowerCase().includes(term),
      );
    });

    return SettingCategory.values
      .map((category) => ({ category, items: filtered.filter((s) => s.category === category) }))
      .filter((group) => group.items.length > 0);
  }, [settings, filter, search]);

  const handleChange = useCallback((key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
    setServerErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleReset = useCallback((key: string) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setServerErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleDiscardAll = () => {
    setDrafts({});
    setServerErrors({});
  };

  const handleSaveAll = async () => {
    if (dirtyKeys.length === 0 || hasInvalid) return;
    setIsSaving(true);

    const results = await Promise.allSettled(
      dirtyKeys.map((key) => {
        const setting = settingsByKey.get(key)!;
        const raw = drafts[key];
        return updateMutation.mutateAsync({
          key,
          value: setting.valueType === 'INTEGER' ? raw.trim() : raw,
        });
      }),
    );

    const failed: Record<string, string> = {};
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failed[dirtyKeys[index]] = getApiErrorMessage(result.reason, 'No se pudo guardar');
      }
    });

    // Solo quedan como borrador los que fallaron, con su error visible en la tarjeta.
    setDrafts((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key in failed)));
    setServerErrors(failed);
    setIsSaving(false);

    const savedCount = dirtyKeys.length - Object.keys(failed).length;
    if (savedCount > 0) {
      setToast(savedCount === 1 ? 'Parámetro guardado' : `${savedCount} parámetros guardados`);
    }
  };

  const availableCategories = SettingCategory.values.filter((c) => (counts[c] ?? 0) > 0);

  return (
    <Stack spacing={3} sx={{ pb: dirtyKeys.length > 0 ? 12 : 0 }}>
      <SectionHeader
        eyebrow="Sistema"
        title="Configuración"
        subtitle="Los cambios se aplican en la siguiente operación que use el parámetro, sin reiniciar nada."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              startIcon={<PriceChangeRounded />}
              to={paths.admin.tariffs}
              variant="text"
            >
              Tramos de tarifa
            </Button>
            <Button
              disabled={settingsQuery.isFetching}
              onClick={() => void settingsQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
          </Stack>
        }
      />

      {!isAdmin && (
        <Alert icon={<VisibilityRounded />} severity="info">
          Estás en modo lectura: solo un administrador puede modificar estos parámetros.
        </Alert>
      )}

      {settingsQuery.isError && (
        <Alert severity="error">
          {getApiErrorMessage(settingsQuery.error, 'No se pudo cargar la configuración')}
        </Alert>
      )}

      {/* Filtro por categoría */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: `repeat(${availableCategories.length + 1}, 1fr)`,
          },
        }}
      >
        {settingsQuery.isLoading ? (
          [0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={78} sx={{ borderRadius: 3 }} />
          ))
        ) : (
          <>
            <CategoryFilterCard
              active={filter === 'ALL'}
              count={counts.ALL ?? 0}
              description="Todos los parámetros"
              icon={<AppsRounded />}
              label="Todas"
              onClick={() => setFilter('ALL')}
              tone="neutral"
            />
            {availableCategories.map((category) => {
              const meta = CATEGORY_META[category];
              const Icon = meta.icon;
              return (
                <CategoryFilterCard
                  key={category}
                  active={filter === category}
                  count={counts[category] ?? 0}
                  description={meta.description}
                  icon={<Icon />}
                  label={SettingCategory.getLabel(category)}
                  onClick={() => setFilter(category)}
                  tone={meta.tone}
                />
              );
            })}
          </>
        )}
      </Box>

      <TextField
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar parámetro por nombre, clave, valor o descripción..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          },
        }}
        value={search}
      />

      {settingsQuery.isLoading ? (
        <AquaPanel liquid>
          <Stack spacing={2}>
            <Skeleton width={180} height={32} />
            <Box
              sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}
            >
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 2.5 }} />
              ))}
            </Box>
          </Stack>
        </AquaPanel>
      ) : visibleGroups.length === 0 ? (
        <AquaPanel liquid sx={{ py: 8 }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <SearchOffRounded sx={{ fontSize: 56, color: 'text.disabled' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Sin resultados
            </Typography>
            <Typography color="text.secondary">
              Ningún parámetro coincide con “{search}”.
            </Typography>
            <Button onClick={() => setSearch('')}>Limpiar búsqueda</Button>
          </Stack>
        </AquaPanel>
      ) : (
        visibleGroups.map(({ category, items }) => {
          const meta = CATEGORY_META[category];
          const Icon = meta.icon;
          return (
            <AquaPanel key={category} liquid sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={(theme) => {
                      const t = getAquaTone(theme, meta.tone);
                      return {
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: 'grid',
                        placeItems: 'center',
                        color: t.accent,
                        bgcolor: t.surface,
                        border: `1px solid ${t.border}`,
                      };
                    }}
                  >
                    <Icon />
                  </Box>
                  <Stack>
                    <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                      {SettingCategory.getLabel(category)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meta.description}
                    </Typography>
                  </Stack>
                </Stack>

                {groupBySection(items).map(([section, sectionItems]) => (
                  <Stack key={section} spacing={1.5}>
                    <Typography
                      variant="overline"
                      sx={(theme) => ({
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        lineHeight: 1,
                        color: getAquaTone(theme, meta.tone).accent,
                      })}
                    >
                      {section}
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                      }}
                    >
                      {sectionItems.map((setting) => (
                        <SettingCard
                          key={setting.settingKey}
                          canEdit={isAdmin}
                          draft={drafts[setting.settingKey]}
                          isSaving={isSaving}
                          onChange={(value) => handleChange(setting.settingKey, value)}
                          onReset={() => handleReset(setting.settingKey)}
                          serverError={serverErrors[setting.settingKey]}
                          setting={setting}
                          tone={meta.tone}
                        />
                      ))}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </AquaPanel>
          );
        })
      )}

      {/* Barra de cambios pendientes */}
      <Slide direction="up" in={dirtyKeys.length > 0} mountOnEnter unmountOnExit>
        <Box
          sx={(theme) => ({
            position: 'fixed',
            zIndex: theme.zIndex.appBar,
            left: 0,
            right: 0,
            bottom: { xs: 12, md: 24 },
            display: 'flex',
            justifyContent: 'center',
            px: 1.5,
            pointerEvents: 'none',
          })}
        >
          <Paper
            elevation={0}
            sx={(theme) => ({
              pointerEvents: 'auto',
              width: { xs: '100%', sm: 'auto' },
              px: { xs: 2, sm: 3 },
              py: 1.5,
              borderRadius: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 1.5, sm: 3 },
              border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
              backdropFilter: 'blur(14px)',
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              boxShadow: `0 18px 48px ${alpha(theme.palette.common.black, 0.28)}`,
            })}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: hasInvalid ? 'error.main' : 'warning.main',
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {hasInvalid
                  ? 'Corrige los valores marcados para guardar'
                  : `${dirtyKeys.length} ${dirtyKeys.length === 1 ? 'cambio sin guardar' : 'cambios sin guardar'}`}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button color="inherit" disabled={isSaving} onClick={handleDiscardAll}>
                Descartar
              </Button>
              <Button
                disabled={isSaving || hasInvalid}
                onClick={() => void handleSaveAll()}
                startIcon={<SaveRounded />}
                variant="contained"
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Slide>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        open={Boolean(toast)}
      >
        <Alert
          icon={<CheckCircleRounded />}
          onClose={() => setToast(null)}
          severity="success"
          variant="filled"
        >
          {toast}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
