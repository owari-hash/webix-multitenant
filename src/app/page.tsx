import MainLayout from 'src/layouts/main';
import HomeView from 'src/sections/_home/view/home-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Webix - Зургаар амилна | Хамгийн алдартай веб комикууд',
  description:
    'Гайхамшигт зургууд, сэтгэл хөдөлгөм түүхүүдийн ертөнцөд нэвтрэн, дэлхийн шилдэг зурагт номуудыг хүлээн ав. Хамгийн алдартай болон тренд веб комикуудыг уншаарай.',
  keywords: 'веб комик, манхва, манга, зурагт ном, уншлага, вебтоон',
  openGraph: {
    title: 'Webix - Зургаар амилна',
    description: 'Гайхамшигт зургууд, сэтгэл хөдөлгөм түүхүүдийн ертөнц',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
