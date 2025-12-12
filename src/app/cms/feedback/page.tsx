import { Metadata } from 'next';

import FeedbackManagementView from 'src/sections/cms/view/feedback-management-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Санал хүсэл гомдол удирдлага | CMS',
};

export default function CMSFeedbackPage() {
  return <FeedbackManagementView />;
}
