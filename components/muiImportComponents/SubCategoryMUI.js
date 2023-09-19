/* eslint-disable prettier/prettier */
import dynamic from 'next/dynamic';

const Autocomplete = dynamic(() => import('@mui/material/Autocomplete'));
const FormControl = dynamic(() => import('@mui/material/FormControl'));
const FormLabel = dynamic(() => import('@mui/material/FormLabel'));
const Box = dynamic(() => import('@mui/material/Box'));
const Button = dynamic(() => import('@mui/material/Button'));
const IconButton = dynamic(() => import('@mui/material/IconButton'));
const ImageList = dynamic(() => import('@mui/material/ImageList'));
const ImageListItem = dynamic(() => import('@mui/material/ImageListItem'));
const List = dynamic(() => import('@mui/material/List'));
const Paper = dynamic(() => import('@mui/material/Paper'));
const TextField = dynamic(() => import('@mui/material/TextField'));
const Typography = dynamic(() => import('@mui/material/Typography'));
const Alert = dynamic(() => import('@mui/material/Alert'));
const CircularProgress = dynamic(() =>
  import('@mui/material/CircularProgress')
);
const ListItem = dynamic(() => import('@mui/material/ListItem'));

const TablePagination = dynamic(() => import('@mui/material/TablePagination'));

const Table = dynamic(() => import('@mui/material/Table'));
const TableBody = dynamic(() => import('@mui/material/TableBody'));
const TableCell = dynamic(() => import('@mui/material/TableCell'));
const TableContainer = dynamic(() => import('@mui/material/TableContainer'));
const TableHead = dynamic(() => import('@mui/material/TableHead'));
const TableRow = dynamic(() => import('@mui/material/TableRow'));

export {
  Autocomplete,
  FormControl,
  FormLabel,
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
};
