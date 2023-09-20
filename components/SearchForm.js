'use client';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const styledList = {
  position: 'absolute',
  zIndex: 10,
  color: 'black',
  fontSize: '14px',
  bgcolor: 'background.paper',
  boxShadow: '1px 1px 8px 2px rgba(150, 150, 150, 0.2)',
  borderRadius: '0 0 4px 4px',
  right: 0,
  left: 0,
};

const SearchForm = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [listOpen, setListOpen] = useState(true);

  const anchorRef = useRef();
  const searchRef = useRef();

  // when search text will highlight in the dropdown list below
  const renderHighlightedTitle = title => {
    const regexPattern = new RegExp(inputValue, 'gi');
    const highlightedTitle = title.replace(
      regexPattern,
      matchText => `<span class="highlight">${matchText}</span>`
    );
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />;
  };

  // handle search on submit
  const handleSubmitSearch = event => {
    event.preventDefault();
    setListOpen(false);
    router.push({
      pathname: '/search/result',
      query: {
        products: JSON.stringify(searchResults),
        searchTitle: JSON.stringify(inputValue),
        category: JSON.stringify(categories[selectedIndex].name),
      },
    });
    // console.log(inputValue);
  };

  // handle search onchange
  const handleSearch = async event => {
    const { value } = event.target;
    setInputValue(value);
    try {
      if (value.length > 0) {
        // console.log('From selected index ==> ', categories[selectedIndex]);
        if (categories[selectedIndex].name === 'All') {
          const { data } = await axios.get(
            `/api/search/allcategory?value=${value}`
          );
          setSearchResults(data);
        } else {
          const categoryID = categories[selectedIndex]._id;
          const { data } = await axios.get(
            `/api/search/singleCategory?category=${categoryID}&value=${value}`
          );
          setSearchResults(data);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // click event handler for the drop product list below search field
  const handleSearchProducts = (event, newProducts) => {
    setListOpen(false);
    router.push({
      pathname: '/search/result',
      query: {
        products: JSON.stringify(newProducts),
        searchTitle: JSON.stringify(inputValue),
        category: JSON.stringify(categories[selectedIndex].name),
      },
    });
  };

  // Toggle the categories beside search
  const handleToggle = () => {
    setOpen(!open);
  };

  // To close the categories beside search
  const handleClose = () => {
    setOpen(false);
  };

  // Close the search item list that show after typing in the search field
  const handleListClose = event => {
    if (!searchRef?.current?.contains(event.target)) {
      setListOpen(false);
    }
    return true;
  };

  // Category item select when clicked on category beside search field
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  // fetch categories from database
  let isCancelled = false;
  useEffect(() => {
    if (!isCancelled) {
      (async function () {
        try {
          const { data } = await axios.get('/api/category/client/view');
          if (data && data.length > 0) {
            data.unshift({ name: 'All' });
            setCategories(data);
          }
        } catch (error) {
          // console.log(error);
        }
        return true;
      })();
    }
    return () => {
      isCancelled = true;
    };
  }, [setCategories]);

  return (
    <>
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Categories dropdown button */}
        <Button
          size="small"
          variant="default"
          onClick={handleToggle}
          ref={anchorRef}
          sx={{ fontSize: '10px' }}
        >
          {categories?.length > 0 && categories?.[selectedIndex].name}
          <ArrowDropDownIcon />
        </Button>

        {/* List of categories */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          transition
          sx={{ zIndex: 1 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper
                sx={{ width: '200px', maxHeight: '400px', overflowY: 'scroll' }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
                    {categories &&
                      categories.length > 0 &&
                      categories.map((category, index) => (
                        <MenuItem
                          key={uuidv4()}
                          sx={{ fontSize: '13px', fontWeight: '500' }}
                          onClick={event => handleMenuItemClick(event, index)}
                          selected={index === selectedIndex}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        {/* form of search field */}
        <Box
          onSubmit={handleSubmitSearch}
          component="form"
          sx={{ display: 'flex', width: '100%' }}
        >
          <TextField
            ref={searchRef}
            size="small"
            placeholder="Search your favorite product..."
            onChange={handleSearch}
            onKeyUp={handleSearch}
            value={inputValue}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
      </Paper>

      {/* Dropdown search results */}
      {/* This section is for if no products found after searching */}
      {inputValue.length > 1 && searchResults?.length < 1 && listOpen ? (
        <ClickAwayListener onClickAway={handleListClose}>
          <List component="nav" dense sx={styledList}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ListItemText>No results found for "{inputValue}"</ListItemText>
              <Typography variant="subtitle2">
                Try checking your spelling or use more general terms
              </Typography>
            </ListItem>
          </List>
        </ClickAwayListener>
      ) : searchResults?.length > 0 && listOpen ? (
        <ClickAwayListener onClickAway={handleListClose}>
          <List component="nav" dense sx={styledList}>
            {searchResults?.map((searchResult, index, newProducts) => (
              <ListItem
                key={searchResult._id}
                sx={{ cursor: 'pointer' }}
                onClick={event => handleSearchProducts(event, newProducts)}
                disablePadding
              >
                <ListItemButton color="primary" sx={{ width: '100%' }}>
                  {renderHighlightedTitle(searchResult?.title)}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </ClickAwayListener>
      ) : (
        ''
      )}
    </>
  );
};

export default SearchForm;
