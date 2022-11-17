import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useState } from 'react';

export default function UploadForm({ onSubmit, isLoading }) {
  const [files, setFiles] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    // e.target = form that was submitted
    // Create FormData from submitted form to be able to send files to api  
    const formData = new FormData(e.target);
    onSubmit(formData);
  }

  function handleFileSelect(e) {
    // Save selected file to state to show preview
    setFiles(Array.from(e.target.files));
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <Box sx={{ mb: 2, mt: 1, width: 300 }}>
        <label htmlFor="contained-button-file">
          <Input
            id="contained-button-file"
            type="file"
            name="file"
            sx={{
              display: 'none',
            }}
            onChange={handleFileSelect}
          />
          <Button variant="outlined" component="span">
            Select file
          </Button>
        </label>
        {files.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {files.map((file, i) => (
              <Chip key={i} label={file.name} />
            ))}
          </Box>
        )}
      </Box>
      <Button type="submit" variant="contained" disabled={isLoading}>
        Upload
      </Button>
    </form>
  );
}
