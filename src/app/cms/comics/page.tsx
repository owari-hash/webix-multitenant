import ComicsListView from 'src/sections/_admin/view/comics-list-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Комикууд | CMS',
  description: 'Manage all webtoons and comics',
};

export default function ComicsListPage() {
  return <ComicsListView />;
}

