import { Metadata } from 'next';

import FeedbackView from 'src/sections/feedback/view/feedback-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Санал хүсэл гомдол | Webtoon',
};

export default function FeedbackPage() {
  return <FeedbackView mode="list" />;
}

