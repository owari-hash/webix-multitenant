import NovelDetailView from 'src/sections/webtoon/view/novel-detail-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Романы дэлгэрэнгүй | Веб комик платформ',
  description: 'Романы дэлгэрэнгүй мэдээлэл болон бүлгүүд',
};

type Props = {
  params: { id: string };
};

export default function NovelDetailPage({ params }: Props) {
  return <NovelDetailView novelId={params.id} />;
}

