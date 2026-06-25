import { useState, type MouseEvent } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import TranslateRounded from '@mui/icons-material/TranslateRounded';

type Language = {
  code: string;
  label: string;
  short: string;
};

const languages: Language[] = [
  { code: 'es', label: 'Espanol', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt', label: 'Portugues', short: 'PT' },
];

function LanguageSelect() {
  const [language, setLanguage] = useState(languages[0]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    handleClose();
  };

  return (
    <>
      <ButtonBase
        aria-controls={open ? 'language-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-label="Seleccionar idioma"
        onClick={handleOpen}
        sx={{
          alignItems: 'center',
          borderRadius: 2,
          color: 'primary.main',
          display: 'inline-flex',
          gap: 0.75,
          minHeight: 40,
          px: { xs: 1, sm: 1.25 },
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(6, 182, 212, 0.08)'
              : 'rgba(14, 165, 233, 0.10)',
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(125, 211, 252, 0.12)'
                : 'rgba(2, 132, 199, 0.14)'
            }`,
        }}
      >
        <TranslateRounded fontSize="small" />
        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 800 }}>
          {language.short}
        </Typography>
        <KeyboardArrowDownRounded fontSize="small" />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="language-menu"
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          mt: 1.25,
          '& .MuiList-root': { minWidth: 190, p: 0.75 },
        }}
      >
        {languages.map((item) => (
          <MenuItem
            key={item.code}
            onClick={() => handleSelect(item)}
            selected={item.code === language.code}
            sx={{ borderRadius: 1.5, gap: 1 }}
          >
            <Typography
              component="span"
              sx={{
                borderRadius: 99,
                color: 'primary.main',
                fontSize: 12,
                fontWeight: 900,
                minWidth: 34,
                px: 1,
                py: 0.25,
                textAlign: 'center',
                backgroundColor: 'rgba(6, 182, 212, 0.10)',
              }}
            >
              {item.short}
            </Typography>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default LanguageSelect;
