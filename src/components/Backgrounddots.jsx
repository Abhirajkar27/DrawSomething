import React from 'react';
import Dots from '../assets/img/BgDots.png';

const Backgrounddots = () => {
  return (
    <div style={{
      position: 'fixed', 
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundImage: `url(${Dots})`,
      backgroundSize: 'cover',  
      backgroundRepeat: 'no-repeat', 
      backgroundPosition: 'center' 
    }} />
  );
}

export default Backgrounddots;
