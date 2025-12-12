import NovelCreateView from 'src/sections/_admin/view/novel-create-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Шинэ роман нэмэх | CMS',
  description: 'Create a new novel',
};

export default function NovelCreatePage() {
  return <NovelCreateView />;
}

