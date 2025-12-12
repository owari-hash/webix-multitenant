import { Metadata } from 'next';

import FeedbackView from 'src/sections/feedback/view/feedback-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Санал хүсэл гомдол илгээх | Webtoon',
};

export default function FeedbackCreatePage() {
  return <FeedbackView mode="create" />;
}

