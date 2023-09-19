function deviceDimension() {
  let devicePixel = null;
  if (typeof window !== 'undefined') {
    if (window.innerWidth <= 576) {
      devicePixel = 1;
    } else if (window.innerWidth <= 992) {
      devicePixel = 2;
    } else if (window.innerWidth <= 1200) {
      devicePixel = 3;
    } else {
      devicePixel = 4;
    }
  }
  return devicePixel;
}

export default deviceDimension;
