import ComicManageView from 'src/sections/_admin/view/comic-manage-view';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
  };
};

export default function ComicManagePage({ params }: Props) {
  const { id } = params;

  return <ComicManageView comicId={id} />;
}

