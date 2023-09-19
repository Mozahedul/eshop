import { useEffect, useRef, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import * as Mui from '../components/muiImportComponents/HomeMUI';

const brands = [
  {
    path: 'https://static.vecteezy.com/system/resources/previews/014/018/561/original/amazon-logo-on-transparent-background-free-vector.jpg',
  },
  {
    path: 'https://images.puma.net/images/fn/~global~others~logosforexternalpartners~PUMA-clothes-shoes-accessories-for-women-men-kids.jpg',
  },
  {
    path: 'https://pbs.twimg.com/profile_images/1573424638734000144/wmSU62eO_400x400.jpg',
  },
  {
    path: 'https://c.static-nike.com/a/images/w_1920,c_limit/mdbgldn6yg1gg88jomci/image.jpg',
  },
  {
    path: 'https://cdn2.iconfinder.com/data/icons/apple-tv-1/512/apple_logo-512.png',
  },
  {
    path: 'https://cdn4.vectorstock.com/i/1000x1000/84/48/letter-g-logitech-logo-design-vector-24198448.jpg',
  },
  {
    path: 'https://files.cults3d.com/uploaders/15233766/illustration-file/1bb3f954-78ee-4917-93c4-a7dab6abfc81/99.jpeg',
  },
  {
    path: 'https://pbs.twimg.com/profile_images/1633774604039667713/AlPRyesM_400x400.jpg',
  },
];

const Brands = () => {
  const sliderRef = useRef(null);
  const [elemWidth, setElemWidth] = useState(0);
  const [disabledPrevBtn, setDisabledPrevBtn] = useState(false);
  const [disabledNextBtn, setDisabledNextBtn] = useState(false);
  // console.log('element width ==> ', elemWidth);

  let scrollPosition = 0;

  const handlePrevButton = () => {
    scrollPosition -= elemWidth;
    sliderRef.current.scrollTo({
      top: 0,
      left: scrollPosition,
      behavior: 'smooth',
    });

    if (scrollPosition <= sliderRef.current.offsetWidth) {
      setDisabledNextBtn(false);
      setDisabledPrevBtn(true);
    }
    // console.log(scrollPosition);
  };

  const handleNextButton = () => {
    scrollPosition += elemWidth;
    sliderRef.current.scrollTo({
      top: 0,
      left: scrollPosition,
      behavior: 'smooth',
    });

    if (scrollPosition > sliderRef.current.scrollWidth - elemWidth) {
      setDisabledPrevBtn(false);
      setDisabledNextBtn(true);
    }
    // console.log(scrollPosition);
    // console.log(sliderRef.current.scrollWidth);
  };

  useEffect(() => {
    if (sliderRef.current) {
      setElemWidth(sliderRef.current.offsetWidth);
      // console.log('current offset width ==> ', sliderRef.current.offsetWidth);
    }
    if (scrollPosition < sliderRef.current.offsetWidth) {
      setDisabledPrevBtn(true);
    } else {
      setDisabledPrevBtn(false);
    }
  }, [sliderRef, scrollPosition]);

  return (
    <>
      <Mui.Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '8px',
          marginTop: '60px',
        }}
      >
        <Mui.Typography
          sx={{ width: '100%', height: '2px', backgroundColor: 'lightgray' }}
        />
        <Mui.Typography
          variant="h1"
          component="h1"
          sx={{
            // borderBottom: '4px solid lightgrey',
            whiteSpace: 'nowrap',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          Our Linked Brands
        </Mui.Typography>
        <Mui.Typography
          sx={{ width: '100%', height: '2px', backgroundColor: 'lightgray' }}
        />
      </Mui.Box>
      <div id="sliderContainer">
        <div className="slider" ref={sliderRef}>
          {brands.map(item => (
            <img src={item.path} alt={item.path} key={item.path} />
          ))}
        </div>
        <div>
          <button
            id="previous"
            type="button"
            onClick={handlePrevButton}
            disabled={disabledPrevBtn}
          >
            <KeyboardArrowLeftIcon />
          </button>
          <button
            id="next"
            type="button"
            onClick={handleNextButton}
            disabled={disabledNextBtn}
          >
            <KeyboardArrowRightIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default Brands;
