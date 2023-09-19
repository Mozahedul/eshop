import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Show error message for password field
const showErrorPasswordMessage = (
  extractEmail,
  upperLowerCase,
  passwordNumber,
  specialChar,
  password
) => (
  <>
    <Typography
      variant="subtitle2"
      sx={{ paddingLeft: '15px', paddingTop: '15px' }}
    >
      Create a password that:
    </Typography>

    {/* check the password that does not contain email */}
    <ListItem
      sx={{ color: extractEmail ? 'red' : 'green', paddingBottom: '0' }}
    >
      <ListItemIcon
        sx={{
          minWidth: '25px',
          color: extractEmail ? 'red' : 'green',
        }}
      >
        {extractEmail ? (
          <FiberManualRecordIcon sx={{ fontSize: '10px' }} />
        ) : (
          <DoneIcon sx={{ fontSize: '12px' }} />
        )}
      </ListItemIcon>
      <Typography fontSize="small">
        does not contain your email address
      </Typography>
    </ListItem>

    {/* minimum password characters check */}
    <ListItem
      sx={{ color: password.length < 8 ? 'red' : 'green', paddingBottom: '0' }}
    >
      <ListItemIcon
        sx={{
          minWidth: '25px',
          color: password.length < 8 ? 'red' : 'green',
        }}
      >
        {password.length < 8 ? (
          <FiberManualRecordIcon sx={{ fontSize: '10px' }} />
        ) : (
          <DoneIcon sx={{ fontSize: '12px' }} />
        )}
      </ListItemIcon>
      <Typography fontSize="small">contains at least 8 characters</Typography>
    </ListItem>

    {/* Check uppercase & lowercase of password */}
    <ListItem
      sx={{ color: upperLowerCase ? 'green' : 'red', paddingBottom: '0' }}
    >
      <ListItemIcon
        sx={{
          minWidth: '25px',
          color: upperLowerCase ? 'green' : 'red',
        }}
      >
        {upperLowerCase ? (
          <DoneIcon sx={{ fontSize: '12px' }} />
        ) : (
          <FiberManualRecordIcon sx={{ fontSize: '10px' }} />
        )}
      </ListItemIcon>
      <Typography fontSize="small">
        contains both lower (a-z) and upper case letters (A-Z)
      </Typography>
    </ListItem>

    {/* Check numbers and special characters of password */}
    <ListItem
      sx={{
        color: passwordNumber || specialChar ? 'green' : 'red',
        paddingBottom: '15px',
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: '25px',
          color: passwordNumber || specialChar ? 'green' : 'red',
        }}
      >
        {passwordNumber || specialChar ? (
          <DoneIcon sx={{ fontSize: '12px' }} />
        ) : (
          <FiberManualRecordIcon sx={{ fontSize: '10px' }} />
        )}
      </ListItemIcon>
      <Typography fontSize="small">
        contains at least one number (0-9) or a symbol
      </Typography>
    </ListItem>
  </>
);

export default showErrorPasswordMessage;
