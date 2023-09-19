import dynamic from 'next/dynamic';

const Alert = dynamic(() => import('@mui/material/Alert'));
const Card = dynamic(() => import('@mui/material/Card'));
// eslint-disable-next-line prettier/prettier
const CircularProgress = dynamic(() =>
  import('@mui/material/CircularProgress')
);
const Grid = dynamic(() => import('@mui/material/Grid'));
const List = dynamic(() => import('@mui/material/List'));
const ListItem = dynamic(() => import('@mui/material/ListItem'));
const Table = dynamic(() => import('@mui/material/Table'));
const TableBody = dynamic(() => import('@mui/material/TableBody'));
const TableCell = dynamic(() => import('@mui/material/TableCell'));
const TableContainer = dynamic(() => import('@mui/material/TableContainer'));
const TableHead = dynamic(() => import('@mui/material/TableHead'));
const TableRow = dynamic(() => import('@mui/material/TableRow'));
const Typography = dynamic(() => import('@mui/material/Typography'));

export {
  Alert,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
};
