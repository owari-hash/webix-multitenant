import WebtoonChapterReadView from 'src/sections/webtoon/view/webtoon-chapter-read-view';
import ChapterGuard from 'src/auth/guard/chapter-guard';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Бүлэг унших | Веб комик платформ',
  description: 'Веб комик унших хуудас',
};

type Props = {
  params: {
    id: string;
    chapterId: string;
  };
};

export default function WebtoonChapterReadPage({ params }: Props) {
  const { id, chapterId } = params;
  return (
    <ChapterGuard>
      <WebtoonChapterReadView comicId={id} chapterId={chapterId} />
    </ChapterGuard>
  );
}

