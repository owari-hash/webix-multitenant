'use client';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';

import SupportNav from '../support-nav';
import SupportHero from '../support-hero';
import SupportContent from '../support-content';

// ----------------------------------------------------------------------

const TOPICS = [
  {
    title: 'Бүртгэл',
    icon: '/assets/icons/faq/ic_faq_account.svg',
    content: (
      <SupportContent
        contents={[
          {
            id: 'acc-1',
            question: 'Нууц үгээ яаж солих вэ?',
            answer: 'Та өөрийн профайл цэсний тохиргоо хэсэг рүү орж нууц үгээ солих боломжтой.',
          },
          {
            id: 'acc-2',
            question: 'Бүртгэлээ яаж устгах вэ?',
            answer: 'Бүртгэл устгах хүсэлтийг манай тусламжийн имэйл хаягаар илгээнэ үү.',
          },
        ]}
      />
    ),
  },
  {
    title: 'Төлбөр тооцоо',
    icon: '/assets/icons/faq/ic_faq_payment.svg',
    content: (
      <SupportContent
        contents={[
          {
            id: 'pay-1',
            question: 'Ямар төлбөрийн хэрэгсэл дэмждэг вэ?',
            answer: 'Бид QPay, SocialPay болон бүх төрлийн банкны картаар төлбөр хүлээн авдаг.',
          },
          {
            id: 'pay-2',
            question: 'Төлбөр буцаах боломжтой юу?',
            answer:
              'Хэрэв таны худалдан авсан контент нээгдээгүй бол та 24 цагийн дотор буцаан авах боломжтой.',
          },
        ]}
      />
    ),
  },
  {
    title: 'Хэрэглээ',
    icon: '/assets/icons/faq/ic_faq_package.svg',
    content: (
      <SupportContent
        contents={[
          {
            id: 'use-1',
            question: 'Аппликейшн ямар төхөөрөмж дээр ажиллах вэ?',
            answer: 'Манай платформ вэб хөтөч болон гар утасны iOS, Android систем дээр ажиллана.',
          },
          {
            id: 'use-2',
            question: 'Оффлайн горимд уншиж болох уу?',
            answer: 'Одоогоор зөвхөн онлайн горимд унших боломжтой байна.',
          },
        ]}
      />
    ),
  },
  {
    title: 'Контент',
    icon: '/assets/icons/faq/ic_faq_delivery.svg',
    content: (
      <SupportContent
        contents={[
          {
            id: 'con-1',
            question: 'Шинэ вебтүүн хэзээ ордог вэ?',
            answer: 'Вебтүүнүүд долоо хоног бүр хуваарийн дагуу шинэчлэгдэн ордог.',
          },
          {
            id: 'con-2',
            question: 'Контентыг яаж мэдээлэх (report) вэ?',
            answer:
              'Та тухайн вебтүүний доор байрлах "Гомдол гаргах" хэсгээр дамжуулан бидэнд мэдэгдэх боломжтой.',
          },
        ]}
      />
    ),
  },
  {
    title: 'Бусад',
    icon: '/assets/icons/faq/ic_faq_assurances.svg',
    content: (
      <SupportContent
        contents={[
          {
            id: 'oth-1',
            question: 'Танай багтай яаж холбогдох вэ?',
            answer: 'Та манай сошиал хуудаснууд болон 7700-0000 утсаар холбогдож болно.',
          },
        ]}
      />
    ),
  },
];

// ----------------------------------------------------------------------

export default function SupportView() {
  const [topic, setTopic] = useState('Төлбөр тооцоо');

  const mobileOpen = useBoolean();

  const handleChangeTopic = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setTopic(newValue);
  }, []);

  useEffect(() => {
    if (mobileOpen.value) {
      mobileOpen.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  return (
    <>
      <SupportHero />

      <Stack
        alignItems="flex-end"
        sx={{
          py: 1.5,
          px: 2.5,
          display: { md: 'none' },
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={mobileOpen.onTrue}>
          <Iconify icon="carbon:menu" />
        </IconButton>
      </Stack>

      <Container>
        <Typography variant="h3" sx={{ py: { xs: 3, md: 10 } }}>
          Түгээмэл асуулт, хариулт
        </Typography>

        <Stack direction="row" sx={{ pb: { xs: 10, md: 15 } }}>
          <SupportNav
            data={TOPICS}
            topic={topic}
            open={mobileOpen.value}
            onChangeTopic={handleChangeTopic}
            onClose={mobileOpen.onFalse}
          />

          {TOPICS.map((item) => item.title === topic && <div key={item.title} style={{ width: '100%' }}>{item.content}</div>)}
        </Stack>
      </Container>
    </>
  );
}
