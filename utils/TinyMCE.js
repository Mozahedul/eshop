import { Editor } from '@tinymce/tinymce-react';
import { useStateValue } from './contextAPI/StateProvider';

const TinyMCE = () => {
  const [state, dispatch] = useStateValue();
  const onChangeHandler = (newValue, editor) => {
    dispatch({
      type: 'TINYMCE_SUCCESS',
      payload: newValue,
    });
  };

  return (
    <Editor
      apiKey="b4rrg4pznulv0mmupuiye0fz4t1y3ezjmj90ggtqhkexd3i6"
      init={{
        height: 200,
        width: '100%',
        placeholder: 'Type your description here...',
        automatic_uploads: false,
        images_upload_url: '/public/images/tinymce',
        file_picker_types: 'image',
      }}
      id="my-tinymce-editor"
      plugins="lists advlist anchor link autoresize autosave charmap code codesample directionality emoticons fullscreen image insertdatetime link media nonbreaking pagebreak preview quickbars save searchreplace table visualblocks visualchars wordcount importcss"
      toolbar="restoredraft numlist bullist link ltr rtl pagebreak searchreplace spellchecker code preview fullscreen importcss"
      menubar="insert tools view file edit table"
      // initialValue="mozahedul Islam is a good and famous programmer in the world"
      // value={value}
      onEditorChange={onChangeHandler}
      min_height="100"
      max-height="500"
    />
  );
};

export default TinyMCE;
