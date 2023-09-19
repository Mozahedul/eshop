import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

const StyledToolBar = styled(Toolbar)(({ theme }) => ({
  '@media all': {
    minHeight: 50,
    color: '#ffffff',
    backgroundColor: '#222939',
  },
}));

const StyledFooter = styled('footer')(({ theme }) => ({
  textAlign: 'center',
  marginTop: '64vh',
}));

export { StyledToolBar, StyledFooter };
