import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { uploadImageFile } from 'src/utils/image-upload';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  value?: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  helperText?: string;
  ratio?: string;
  maxSize?: number;
};

export default function UploadImage({
  value,
  onChange,
  onUpload,
  helperText,
  ratio = '3/4',
  maxSize = 5242880, // 5MB
}: Props) {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError('');
        const file = acceptedFiles[0];

        if (file.size > maxSize) {
          setError(`Файлын хэмжээ ${maxSize / 1024 / 1024}MB-аас бага байх ёстой`);
          return;
        }

        setUploading(true);

        if (onUpload) {
          // Use custom upload handler
          const url = await onUpload(file);
          onChange(url);
        } else {
          // Upload to server using file upload (not base64)
          try {
            const url = await uploadImageFile(file);
            onChange(url);
          } catch (uploadError) {
            console.error('File upload failed:', uploadError);
            setError('Зураг байршуулахад алдаа гарлаа. Дахин оролдоно уу.');
          }
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError('Зураг байршуулахад алдаа гарлаа');
      } finally {
        setUploading(false);
      }
    },
    [onChange, onUpload, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: false,
    disabled: uploading,
  });

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <Box>
      {!value ? (
        <Box
          {...getRootProps()}
          sx={{
            p: 3,
            borderRadius: 2,
            cursor: 'pointer',
            border: `2px dashed ${
              isDragActive
                ? theme.palette.primary.main
                : alpha(theme.palette.grey[500], 0.3)
            }`,
            bgcolor: isDragActive
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.grey[500], 0.04),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <input {...getInputProps()} />
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon={uploading ? 'carbon:cloud-upload' : 'carbon:image'}
                sx={{ fontSize: 32, color: 'primary.main' }}
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {uploading ? 'Байршуулж байна...' : 'Зураг сонгох'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isDragActive
                  ? 'Зургийг энд тавина уу'
                  : 'Зургийг чирж тавих эсвэл дарж сонгоно уу'}
              </Typography>
            </Box>

            {helperText && (
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {helperText}
              </Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
            }}
          >
            <Box
              component="img"
              src={value}
              alt="Preview"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/placeholder.jpg';
              }}
              sx={{
                width: '100%',
                maxWidth: 300,
                aspectRatio: ratio,
                objectFit: 'cover',
                borderRadius: 1,
                mx: 'auto',
                display: 'block',
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="carbon:trash-can" />}
              onClick={handleRemove}
            >
              Устгах
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="carbon:renew" />}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              Солих
            </Button>
          </Stack>
        </Box>
      )}

      {error && (
        <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

