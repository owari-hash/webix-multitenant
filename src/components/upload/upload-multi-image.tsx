import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

// Compress image before converting to base64
// Optimized for webtoon pages: 800px width, 75% quality
const compressImage = (file: File, maxWidth = 800, quality = 0.75): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        try {
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

type Props = {
  value?: string[];
  onChange: (urls: string[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  helperText?: string;
  maxSize?: number;
  maxFiles?: number;
};

export default function UploadMultiImage({
  value = [],
  onChange,
  onUpload,
  helperText,
  maxSize = 20971520, // 20MB per file
  maxFiles = 100, // Max 100 images
}: Props) {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError('');
        setUploading(true);
        setUploadProgress(0);

        // Check total number of images
        if (value.length + acceptedFiles.length > maxFiles) {
          setError(
            `Хамгийн ихдээ ${maxFiles} зураг оруулах боломжтой. Одоо ${value.length} зураг байна.`
          );
          setUploading(false);
          return;
        }

        // Check file sizes
        const invalidFiles = acceptedFiles.filter((file) => file.size > maxSize);
        if (invalidFiles.length > 0) {
          setError(`Зарим файлын хэмжээ ${maxSize / 1024 / 1024}MB-аас их байна`);
          setUploading(false);
          return;
        }

        if (onUpload) {
          // Use custom upload handler
          const urls = await onUpload(acceptedFiles);
          onChange([...value, ...urls]);
        } else {
          // Compress and convert to base64 one by one to avoid memory issues
          const urls: string[] = [];

          // eslint-disable-next-line no-restricted-syntax
          for (let i = 0; i < acceptedFiles.length; i += 1) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const compressedUrl = await compressImage(acceptedFiles[i]);
              urls.push(compressedUrl);
              setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
            } catch (err) {
              console.error(`Error processing file ${i + 1}:`, err);
              setError(`Зураг ${i + 1} боловсруулахад алдаа гарлаа`);
              break;
            }
          }

          if (urls.length > 0) {
            onChange([...value, ...urls]);
          }
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError('Зураг байршуулахад алдаа гарлаа');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [onChange, onUpload, maxSize, maxFiles, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
    disabled: uploading,
  });

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleRemoveAll = () => {
    onChange([]);
    setError('');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...value];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onChange(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newImages = [...value];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    onChange(newImages);
  };

  return (
    <Box>
      {/* Upload Area */}
      <Box
        {...getRootProps()}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          cursor: 'pointer',
          border: `2px dashed ${
            isDragActive ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.3)
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
              {uploading ? 'Байршуулж байна...' : 'Зургууд сонгох'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isDragActive
                ? 'Зургуудыг энд тавина уу'
                : 'Олон зураг зэрэг чирж тавих эсвэл дарж сонгоно уу'}
            </Typography>
          </Box>

          {helperText && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {helperText}
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Progress Bar */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ height: 8, borderRadius: 1, mb: 1 }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Боловсруулж байна... {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* Error/Warning Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {value.length >= maxFiles * 0.8 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Анхаар: Та {maxFiles} зургийн хязгаараас {value.length} зураг оруулсан байна.
        </Alert>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Нийт зураг: {value.length}
            </Typography>
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="carbon:trash-can" />}
              onClick={handleRemoveAll}
            >
              Бүгдийг устгах
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {value.map((url, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    position: 'relative',
                    p: 1,
                    '&:hover .action-buttons': {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Image Number Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      bgcolor: alpha(theme.palette.common.black, 0.7),
                      color: 'common.white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    #{index + 1}
                  </Box>

                  {/* Action Buttons */}
                  <Stack
                    className="action-buttons"
                    direction="row"
                    spacing={0.5}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      opacity: { xs: 1, sm: 0 },
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      sx={{
                        bgcolor: alpha(theme.palette.common.black, 0.7),
                        color: 'common.white',
                        '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.9) },
                        '&.Mui-disabled': { opacity: 0.3 },
                      }}
                    >
                      <Iconify icon="carbon:chevron-up" width={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === value.length - 1}
                      sx={{
                        bgcolor: alpha(theme.palette.common.black, 0.7),
                        color: 'common.white',
                        '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.9) },
                        '&.Mui-disabled': { opacity: 0.3 },
                      }}
                    >
                      <Iconify icon="carbon:chevron-down" width={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(index)}
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.9),
                        color: 'common.white',
                        '&:hover': { bgcolor: theme.palette.error.dark },
                      }}
                    >
                      <Iconify icon="carbon:trash-can" width={16} />
                    </IconButton>
                  </Stack>

                  {/* Image Preview */}
                  <Box
                    component="img"
                    src={url}
                    alt={`Image ${index + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/placeholder.jpg';
                    }}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
