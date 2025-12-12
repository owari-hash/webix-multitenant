'use client';

import { useParams } from 'next/navigation';

import FeedbackDetailView from 'src/sections/cms/view/feedback-detail-view';

// ----------------------------------------------------------------------

export default function CMSFeedbackDetailPage() {
  const params = useParams();
  const feedbackId = params?.id as string;

  if (!feedbackId) {
    return null;
  }

  return <FeedbackDetailView feedbackId={feedbackId} />;
}

