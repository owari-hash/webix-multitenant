import NovelChapterCreateView from 'src/sections/_admin/view/novel-chapter-create-view';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: 'Шинэ бүлэг нэмэх | CMS',
  description: 'Add new chapter to novel',
};

export default function NovelChapterCreatePage({ params }: Props) {
  return <NovelChapterCreateView novelId={params.id} />;
}


