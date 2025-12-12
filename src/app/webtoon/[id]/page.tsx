import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function WebtoonIdRedirectPage({ params }: Props) {
  // Redirect /webtoon/[id] to /webtoon/comic/[id]
  redirect(`/webtoon/comic/${params.id}`);
}


