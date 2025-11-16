import ChapterCreateView from 'src/sections/_admin/view/chapter-create-view';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: 'Шинэ бүлэг нэмэх | CMS',
  description: 'Add new chapter to comic',
};

export default function ChapterCreatePage({ params }: Props) {
  return <ChapterCreateView comicId={params.id} />;
}

