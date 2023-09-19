import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import * as Mui from './muiImportComponents/ProductMUI';

const Breadcrumbs = ({ breadcrumbs }) => {
  const router = useRouter();
  // Deep copy of breadcrumbs
  const breadcrumbArr = breadcrumbs
    ? JSON.parse(JSON.stringify(breadcrumbs))
    : [];

  if (breadcrumbArr !== []) {
    breadcrumbArr[0] = '/';
    breadcrumbArr.forEach((element, index) => {
      if (index > 1) {
        breadcrumbArr[index] = `/${element}`;
      }
    });
  }

  // For setting the url in href
  function breadcrumbURL(index, arr) {
    const slicedUrl = arr.slice(0, index + 1);
    const urlString = slicedUrl.join('');
    return urlString;
  }

  return (
    <Mui.Box
      sx={{
        backgroundColor: '#f2f2f2',
        padding: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Mui.Breadcrumbs fontSize="small">
        {breadcrumbArr.map((breadcrumb, index, arr) => (
          <Link
            className="breadcrumbLink"
            key={breadcrumb}
            href={breadcrumbURL(index, arr)}
          >
            {breadcrumb === '/' ? 'Home' : breadcrumb.replace('/', '')}
          </Link>
        ))}
      </Mui.Breadcrumbs>
      <Mui.Button
        onClick={() => router.back()}
        variant="text"
        color="secondary"
        size="small"
      >
        <KeyboardBackspaceIcon /> Previous page
      </Mui.Button>
    </Mui.Box>
  );
};

export default Breadcrumbs;
