import { Metadata } from 'next';

import FeedbackView from 'src/sections/feedback/view/feedback-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Миний санал хүсэл гомдол | Webtoon',
};

export default function FeedbackMyPage() {
  return <FeedbackView mode="list" />;
}

