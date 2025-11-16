import ComicCreateView from 'src/sections/_admin/view/comic-create-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Шинэ комик нэмэх | CMS',
  description: 'Add new webtoon/comic to the platform',
};

export default function ComicCreatePage() {
  return <ComicCreateView />;
}

