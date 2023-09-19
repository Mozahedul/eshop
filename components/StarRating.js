import React from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { Box } from '@mui/material';

const StarRating = ({ rating, starSize }) => {
  // console.log(rating);
  return (
    <Box>
      {rating && rating > 0 && (
        <>
          <span style={{ color: '#f0c000' }}>
            {rating >= 1 ? (
              <StarRoundedIcon sx={{ fontSize: starSize }} />
            ) : rating >= 0.5 ? (
              <StarHalfRoundedIcon sx={{ fontSize: starSize }} />
            ) : (
              <StarBorderRoundedIcon sx={{ fontSize: starSize }} />
            )}
          </span>
          <span style={{ color: '#f0c000' }}>
            {rating >= 2 ? (
              <StarRoundedIcon sx={{ fontSize: starSize }} />
            ) : rating >= 1.5 ? (
              <StarHalfRoundedIcon sx={{ fontSize: starSize }} />
            ) : (
              <StarBorderRoundedIcon sx={{ fontSize: starSize }} />
            )}
          </span>

          <span style={{ color: '#f0c000' }}>
            {rating >= 3 ? (
              <StarRoundedIcon sx={{ fontSize: starSize }} />
            ) : rating >= 2.5 ? (
              <StarHalfRoundedIcon sx={{ fontSize: starSize }} />
            ) : (
              <StarBorderRoundedIcon sx={{ fontSize: starSize }} />
            )}
          </span>
          <span style={{ color: '#f0c000' }}>
            {rating >= 4 ? (
              <StarRoundedIcon sx={{ fontSize: starSize }} />
            ) : rating >= 3.5 ? (
              <StarHalfRoundedIcon sx={{ fontSize: starSize }} />
            ) : (
              <StarBorderRoundedIcon sx={{ fontSize: starSize }} />
            )}
          </span>
          <span style={{ color: '#f0c000' }}>
            {rating >= 5 ? (
              <StarRoundedIcon sx={{ fontSize: starSize }} />
            ) : rating >= 4.5 ? (
              <StarHalfRoundedIcon sx={{ fontSize: starSize }} />
            ) : (
              <StarBorderRoundedIcon sx={{ fontSize: starSize }} />
            )}
          </span>
        </>
      )}
    </Box>
  );
};

export default StarRating;
