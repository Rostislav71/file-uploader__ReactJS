import axios from 'axios';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import FilesList from './components/FilesList';
import UploadForm from './components/UploadForm';
import Account from './components/Account';


// Set url prefix for all axios requests
axios.defaults.baseURL = 'http://localhost:3000';

function App() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Run getAllFiles on page load
  useEffect(getAllFiles, []);

  // Api request to get all files data
  function getAllFiles() {
    setIsLoading(true);

    axios
      .get('/')
      .then((res) => {
        setFiles(res.data.resources);
        setError(null);
      })
      .catch((err) => {
        // If API successfully processed error, than error response is stored is err.response.data
        // If error.response is not available or error response.data is empty we use err.message
        // err.message is not really descriptive but it should be used as a fallback
        setError(err.response?.data || err.message);
        console.dir(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Api request to upload new file
  function onSubmit(formData) {
    setIsLoading(true);

    axios
      .post('/upload', formData)
      .then((res) => {
        // Add newly uploaded file data to the start of files array
        setFiles((prevFiles) => [res.data, ...prevFiles]);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data || err.message);
        console.dir(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Api request to upload delete existing file
  function deleteFile(publicId, resourceType) {
    setIsLoading(true);
    console.log(publicId);
    console.log(resourceType);
    axios
      .delete(`/${publicId}`, {
        data: {
          resourceType,
        },
      })
      .then((res) => {
        // Filter deleted file from files array
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.public_id !== publicId)
        );
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data || err.message);
        console.dir(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Router>
      <Container>
      <Typography component="h1" variant="h4" sx={{ mb: 2, mt: 2 }}>
        File uploader
      </Typography>
      <Paper  sx={{ mb: 3, p: '16px' }}>
          <div className='form__routes'>
            <UploadForm onSubmit={onSubmit} isLoading={isLoading} />
            <div className='links'>
              <Link className='routeLink' to="/">
                  <TableViewIcon  sx={{ fontSize: 40 }}/>
              </Link>
              <Link className='routeLink' to="/account">
                  <PersonIcon sx={{ fontSize: 40 }}/>
              </Link>
            </div>
          </div>
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      
        <Routes>
          <Route path='/' element={<FilesList files={files} isLoading={isLoading} onDelete={deleteFile} />}/>
          <Route path='/account' element={<Account />} />
        </Routes>
      
      </Container>
    </Router>
  );
}

export default App;
