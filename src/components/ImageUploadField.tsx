import { useEffect, useRef, useState } from 'react';

import BrokenImageRounded from '@mui/icons-material/BrokenImageRounded';
import CloudUploadRounded from '@mui/icons-material/CloudUploadRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import ImageRounded from '@mui/icons-material/ImageRounded';
import PhotoCameraRounded from '@mui/icons-material/PhotoCameraRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type ImageUploadFieldProps = {
  label?: string;
  helperText?: string;
  error?: boolean;
  maxSizeMb?: number;
  accept?: string;
  initialImageUrl?: string;
  /** Aviso fijo bajo el campo (p. ej. que la imagen aún no se envía al backend). */
  notice?: string;
  onChange: (file: File | null) => void;
};

export default function ImageUploadField({
  label = 'Imagen',
  helperText = 'JPG, PNG o WEBP',
  error = false,
  maxSizeMb = 5,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  initialImageUrl,
  notice,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // La URL temporal se crea al elegir el archivo (no en un efecto) y se libera al cambiarla o desmontar.
  const objectUrlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const replaceObjectUrl = (nextFile: File | null) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = nextFile ? URL.createObjectURL(nextFile) : null;
    setPreview(objectUrlRef.current);
  };

  const selectFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    setUploadError(null);

    const allowedTypes = accept.split(',').map((type) => type.trim());

    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError('Formato no permitido. Selecciona JPG, PNG, WEBP o GIF.');
      return;
    }

    if (selectedFile.size > maxSizeMb * 1024 * 1024) {
      setUploadError(`La imagen debe pesar como máximo ${maxSizeMb} MB.`);
      return;
    }

    replaceObjectUrl(selectedFile);
    setFile(selectedFile);
    onChange(selectedFile);
  };

  const removeImage = () => {
    replaceObjectUrl(null);
    setFile(null);
    setUploadError(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const openFilePicker = () => inputRef.current?.click();

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>

      <Box
        role="button"
        tabIndex={0}
        aria-label="Seleccionar una imagen"
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }}
        sx={{
          position: 'relative',
          minHeight: 220,
          border: '2px dashed',
          borderColor: error ? 'error.main' : dragging ? 'primary.main' : 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          bgcolor: dragging ? 'action.hover' : 'background.default',
          transition: 'border-color 160ms, background-color 160ms',
          outline: 'none',
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        {preview ? (
          <>
            <Box
              component="img"
              src={preview}
              alt="Vista previa de la imagen seleccionada"
              onError={() => setUploadError('No se pudo mostrar la imagen.')}
              sx={{
                display: 'block',
                width: '100%',
                maxHeight: 320,
                objectFit: 'contain',
                p: 1,
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                p: 2,
                opacity: 0,
                bgcolor: 'rgba(0,0,0,0.45)',
                transition: 'opacity 180ms',
                '&:hover': { opacity: 1 },
                '@media (hover: none)': { opacity: 1 },
              }}
            >
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                <CloudUploadRounded fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Toca para cambiar la imagen
              </Typography>
            </Box>
          </>
        ) : (
          <Stack spacing={1.5} sx={{ alignItems: 'center', p: 3 }}>
            {dragging ? (
              <CloudUploadRounded sx={{ fontSize: 48, color: 'primary.main' }} />
            ) : (
              <ImageRounded sx={{ fontSize: 48, color: 'text.secondary' }} />
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {dragging ? 'Suelta tu imagen aquí' : 'Selecciona una imagen'}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Arrastra y suelta tu archivo aquí o búscalo en tu dispositivo.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {helperText} · Máximo {maxSizeMb} MB
            </Typography>

            <Button
              variant="contained"
              startIcon={<PhotoCameraRounded />}
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
            >
              Elegir imagen
            </Button>
          </Stack>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          selectFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      {file && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <ImageRounded color="primary" />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
              {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </Typography>
          </Box>

          <Tooltip title="Cambiar imagen">
            <IconButton aria-label="Cambiar imagen" onClick={openFilePicker} size="small">
              <CloudUploadRounded />
            </IconButton>
          </Tooltip>

          <Tooltip title="Quitar imagen">
            <IconButton aria-label="Quitar imagen" onClick={removeImage} size="small" color="error">
              <DeleteRounded />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      {notice && (
        <Alert severity="info" variant="outlined">
          {notice}
        </Alert>
      )}

      {uploadError && (
        <Alert severity="error" icon={<BrokenImageRounded />} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}
    </Stack>
  );
}
