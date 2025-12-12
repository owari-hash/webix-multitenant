import NovelChapterReadView from 'src/sections/webtoon/view/novel-chapter-read-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Бүлэг унших | Веб комик платформ',
  description: 'Романы бүлэг унших хуудас',
};

type Props = {
  params: {
    id: string;
    chapterId: string;
  };
};

export default function NovelChapterReadPage({ params }: Props) {
  const { id, chapterId } = params;
  return <NovelChapterReadView novelId={id} chapterId={chapterId} />;
}

