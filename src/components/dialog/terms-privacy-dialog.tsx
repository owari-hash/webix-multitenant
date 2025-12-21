'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export default function TermsPrivacyDialog({ open, onClose, onAccept }: Props) {
  const theme = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Check if user has scrolled to bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    setHasScrolledToBottom(isAtBottom);
  };

  // Reset scroll state when dialog opens
  useEffect(() => {
    if (open) {
      setHasScrolledToBottom(false);
      // Reset scroll position
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="solar:document-text-bold" width={32} sx={{ color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>
            Үйлчилгээний нөхцөл болон Нууцлалын бодлого
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box
          ref={scrollContainerRef}
          onScroll={handleScroll}
          sx={{
            height: '60vh',
            overflow: 'auto',
            px: 3,
            py: 2,
          }}
        >
          <Stack spacing={4}>
              {/* Terms of Service Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  1. Үйлчилгээний нөхцөл
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Танай бүртгэл үүсгэх, нэвтрэх, манай үйлчилгээг ашиглах нь эдгээр үйлчилгээний
                    нөхцөлд зөвшөөрч байгаа гэсэн үг юм. Хэрэв та эдгээр нөхцөлд зөвшөөрөхгүй
                    бол, манай үйлчилгээг ашиглах боломжгүй.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Манай платформ нь контент бүтээгчдэд зориулсан зурагт номын вэбсайт түрээсийн
                    систем юм. Та бүртгэл үүсгэхдээ зөв, бүрэн, хамгийн сүүлийн үеийн мэдээлэл
                    өгөх үүрэгтэй.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Та бүртгэлээ хамгаалах үүрэгтэй. Нууц үгээ хэн чтэй хуваалцахгүй, хамгаалах
                    үүрэгтэй. Хэрэв та бүртгэлдээ хандах эрхтэй хүн нууц үгээ мэддэг бол, та
                    тэр даруй нууц үгээ өөрчлөх ёстой.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Та манай үйлчилгээг зөвхөн хууль ёсны зорилгоор ашиглах ёстой. Та хууль бус
                    үйлдэл, зөрчил, эсвэл бусад хүмүүсийн эрх, эрх чөлөөг зөрчих үйлдэл хийх
                    ёсгүй.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Манай компани нь үйлчилгээний чанар, найдвартай байдал, эсвэл үйлчилгээний
                    тасралтгүй байдлыг баталгаажуулахгүй. Манай үйлчилгээг &quot;ямар ч баталгаагүй&quot;
                    байдлаар өгч байна.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Манай компани нь ямар ч шалтгаанаар үйлчилгээгээ түдгэлзүүлэх, зогсоох, эсвэл
                    цуцлах эрхтэй. Энэ тохиолдолд танд урьдчилан мэдэгдэхгүй байж болно.
                  </Typography>
                </Stack>
              </Box>

              {/* Privacy Policy Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  2. Нууцлалын бодлого
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Манай компани таны хувийн мэдээллийг хамгаалах, хүндэтгэх үүрэгтэй. Бид
                    таны мэдээллийг зөвхөн үйлчилгээгээ сайжруулах, танд илүү сайн туршлага
                    өгөх зорилгоор ашиглана.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Бид таны нэр, имэйл хаяг, нууц үг зэрэг хувийн мэдээллийг цуглуулдаг. Эдгээр
                    мэдээллийг бид зөвхөн таны бүртгэлийг удирдах, танд үйлчилгээ үзүүлэх
                    зорилгоор ашиглана.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Бид таны мэдээллийг гуравдагч этгээдэд худалдах, түрээслэх, эсвэл бусад
                    аргаар хуваалцахгүй, зөвхөн хуулийн шаардлагад нийцсэн тохиолдолд л
                    хуваалцна.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Бид таны мэдээллийг хамгаалахын тулд техникийн болон байгууллагын арга
                    хэмжээ авдаг. Гэхдээ интернетээр дамжуулах мэдээлэл 100% аюулгүй байх
                    баталгаа байхгүй.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Та өөрийн хувийн мэдээллийг харах, засах, устгах эрхтэй. Хэрэв та ийм
                    хүсэлт гаргавал бид танд туслах болно.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Бид таны мэдээллийг хадгалах хугацааг хуулийн шаардлагад нийцүүлэн
                    тодорхойлно. Хэрэв та бүртгэлээ устгавал бид таны мэдээллийг хуулийн
                    шаардлагад нийцүүлэн устгана.
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Эдгээр нууцлалын бодлогод өөрчлөлт оруулах боломжтой. Хэрэв бид өөрчлөлт
                    оруулбал танд мэдэгдэх болно. Та үйлчилгээгээ үргэлжлүүлэн ашигласнаар
                    шинэчлэгдсэн нөхцөлд зөвшөөрч байгаа гэсэн үг юм.
                  </Typography>
                </Stack>
              </Box>

              {/* Final Notice */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" sx={{ textAlign: 'justify', fontWeight: 500 }}>
                  Дээрх бүх нөхцөлийг уншиж, ойлгосны дараа л &quot;Зөвшөөрч байна&quot; товчийг дараарай.
                  Хэрэв та эдгээр нөхцөлд зөвшөөрөхгүй бол &quot;Цуцлах&quot; товчийг дараад бүртгэл
                  үүсгэхгүй байх хэрэгтэй.
                </Typography>
              </Box>
            </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            minWidth: 120,
            borderRadius: 2,
          }}
        >
          Цуцлах
        </Button>
        <Button
          onClick={onAccept}
          variant="contained"
          disabled={!hasScrolledToBottom}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            fontWeight: 700,
          }}
          startIcon={<Iconify icon="solar:check-circle-bold" />}
        >
          Зөвшөөрч байна
        </Button>
      </DialogActions>

      {!hasScrolledToBottom && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'warning.main' }} />
          <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
            Бүх нөхцөлийг уншиж дуусгах хэрэгтэй
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}

