import { useParams } from 'react-router-dom';
import Title from '../../components/UI/Title';
import BackBtn from '../../components/UI/BackBtn';

import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

const CreateGroupRules = () => {
  const params = useParams();

  const cloud = useCKEditorCloud({
    version: '48.1.1',
    translations: ['es'],
  });

  if (cloud.status === 'error') {
    return <div>Error!</div>;
  }

  if (cloud.status === 'loading') {
    return <div>Loading...</div>;
  }

  const { ClassicEditor, Essentials, Bold, Italic, Paragraph } = cloud.CKEditor;

  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      <BackBtn url={`/account/manage-group/view/${params.groupId}`} />

      {/* Form title */}
      <Title title='manage group rules' />

      <CKEditor
        editor={ClassicEditor}
        data={'<p>Hello world!</p>'}
        config={{
          licenseKey: '<YOUR_LICENSE_KEY>',
          plugins: [Essentials, Paragraph, Bold, Italic],
          toolbar: [
            'undo',
            'redo',
            '|',
            'bold',
            'italic',
            '|',
            'formatPainter',
          ],
        }}
      />
    </div>
  );
};

export default CreateGroupRules;
