import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import FileDownload from '@mui/icons-material/FileDownload';
import Delete from '@mui/icons-material/Delete';

export default function FilesList({ files, isLoading, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" component="h2" sx={{ ml: '16px', pt: 2 }}>
        Uploaded files
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ ml: '16px', mt: 1, mb: 2 }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Public ID</TableCell>
              <TableCell>Asset ID</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((fileData, i) => (
              <TableRow key={fileData.asset_id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell sx={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                  {fileData.public_id}
                </TableCell>
                <TableCell>{fileData.asset_id}</TableCell>
                <TableCell>{fileData.format}</TableCell>
                <TableCell>
                  {new Date(fileData.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    component="a"
                    href={fileData.url}
                    download
                    target="_blank"
                  >
                    <FileDownload />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      onDelete(fileData.public_id, fileData.resource_type)
                    }
                  >
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
