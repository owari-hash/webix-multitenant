import MainLayout from 'src/layouts/main';
import HomeView from 'src/sections/_home/view/home-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Webix - Зургаар амилна',
  description:
    'Immerse yourself in captivating stories with stunning artwork. Read the latest webtoons from talented creators around the world.',
};

export default function HomePage() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
