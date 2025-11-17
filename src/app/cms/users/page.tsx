import { Metadata } from 'next';

import UsersListView from 'src/sections/_admin/view/users-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Хэрэглэгчид | CMS',
};

export default function Page() {
  return <UsersListView />;
}

