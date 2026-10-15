import AddRounded from '@mui/icons-material/AddRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LockRounded from '@mui/icons-material/LockRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import UndoRounded from '@mui/icons-material/UndoRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { getSettingMeta } from 'modules/settings/settings.meta';
import { TEXT_SETTING_MAX_LENGTH, type Setting } from 'modules/settings/types/setting.types';
import { validateSettingValue } from 'modules/settings/utils/validateSetting';
import { getAquaTone, type AquaTone } from 'shared/ui/aqua/aquaTones';

type SettingCardProps = {
  canEdit: boolean;
  /** Borrador sin guardar; undefined = sin cambios. */
  draft?: string;
  /** Error devuelto por el backend al guardar. */
  serverError?: string;
  isSaving: boolean;
  setting: Setting;
  tone: AquaTone;
  onChange: (value: string) => void;
  onReset: () => void;
};

export default function SettingCard({
  canEdit,
  draft,
  serverError,
  isSaving,
  setting,
  tone,
  onChange,
  onReset,
}: SettingCardProps) {
  const meta = getSettingMeta(setting.settingKey);
  const Icon = meta.icon;
  const value = draft ?? setting.value;
  const isDirty = draft !== undefined && draft !== setting.value;
  const editable = canEdit && !setting.readOnly;
  const validationError = isDirty ? validateSettingValue(setting, value) : null;
  const error = validationError ?? serverError ?? null;
  const isInteger = setting.valueType === 'INTEGER';
  const numeric = /^\d+$/.test(value.trim()) ? Number(value.trim()) : null;

  const step = (delta: number) => onChange(String(Math.max(0, (numeric ?? 0) + delta)));

  return (
    <Box
      sx={(theme) => {
        const t = getAquaTone(theme, tone);
        const accent = error ? theme.palette.error.main : isDirty ? t.accent : null;
        return {
          position: 'relative',
          p: 2.25,
          height: '100%',
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: accent ? alpha(accent, 0.6) : 'divider',
          bgcolor: setting.readOnly
            ? alpha(theme.palette.text.primary, 0.02)
            : isDirty
              ? alpha(t.accent, 0.05)
              : 'transparent',
          transition: 'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
          '&:hover': editable
            ? {
                borderColor: accent ? alpha(accent, 0.8) : t.border,
                boxShadow: `0 6px 20px ${alpha(t.accent, 0.08)}`,
              }
            : undefined,
        };
      }}
    >
      <Stack spacing={1.75}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={(theme) => {
              const t = getAquaTone(theme, setting.readOnly ? 'neutral' : tone);
              return {
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: t.accent,
                bgcolor: t.surface,
              };
            }}
          >
            <Icon fontSize="small" />
          </Box>

          <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                {meta.label}
              </Typography>
              <Tooltip arrow placement="top" title={setting.description}>
                <InfoOutlined sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }} />
              </Tooltip>
              {isDirty && (
                <Box
                  component="span"
                  sx={(theme) => ({
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: getAquaTone(theme, tone).accent,
                  })}
                />
              )}
            </Stack>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', wordBreak: 'break-all' }}
            >
              {setting.settingKey}
            </Typography>
          </Stack>

          {setting.readOnly && (
            <Chip icon={<LockRounded />} label="Sistema" size="small" variant="outlined" />
          )}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          {isInteger && editable && (
            <IconButton
              aria-label="Disminuir"
              disabled={isSaving || numeric === null || numeric <= 0}
              onClick={() => step(-1)}
              size="small"
              sx={{ mt: 0.5, border: '1px solid', borderColor: 'divider' }}
            >
              <RemoveRounded fontSize="small" />
            </IconButton>
          )}

          <TextField
            disabled={!editable || isSaving}
            error={Boolean(error)}
            fullWidth
            helperText={
              error ??
              (!isInteger && editable ? `${value.length}/${TEXT_SETTING_MAX_LENGTH}` : undefined)
            }
            multiline={!isInteger}
            maxRows={4}
            onChange={(e) => onChange(e.target.value)}
            placeholder={meta.placeholder}
            size="small"
            slotProps={{
              htmlInput: {
                inputMode: isInteger ? 'numeric' : undefined,
                maxLength: isInteger ? undefined : TEXT_SETTING_MAX_LENGTH,
                style: isInteger ? { textAlign: 'center', fontWeight: 700 } : undefined,
              },
              input: meta.unit
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {meta.unit}
                        </Typography>
                      </InputAdornment>
                    ),
                  }
                : undefined,
              formHelperText: { sx: { textAlign: error ? 'left' : 'right', mx: 0.5 } },
            }}
            value={value}
          />

          {isInteger && editable && (
            <IconButton
              aria-label="Aumentar"
              disabled={isSaving}
              onClick={() => step(1)}
              size="small"
              sx={{ mt: 0.5, border: '1px solid', borderColor: 'divider' }}
            >
              <AddRounded fontSize="small" />
            </IconButton>
          )}

          {isDirty && (
            <Tooltip title={`Restaurar valor guardado (${setting.value})`}>
              <span>
                <IconButton disabled={isSaving} onClick={onReset} size="small" sx={{ mt: 0.5 }}>
                  <UndoRounded fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
