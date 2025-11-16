import WebtoonComicDetailView from 'src/sections/webtoon/view/webtoon-comic-detail-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Комикийн дэлгэрэнгүй | Веб комик платформ',
  description: 'Комикийн дэлгэрэнгүй мэдээлэл болон бүлгүүд',
};

type Props = {
  params: { id: string };
};

export default function WebtoonComicDetailPage({ params }: Props) {
  return <WebtoonComicDetailView comicId={params.id} />;
}

