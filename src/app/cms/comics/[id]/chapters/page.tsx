import ChaptersListView from 'src/sections/_admin/view/chapters-list-view';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: 'Бүлгүүд | CMS',
  description: 'Manage comic chapters',
};

export default function ChaptersListPage({ params }: Props) {
  return <ChaptersListView comicId={params.id} />;
}

