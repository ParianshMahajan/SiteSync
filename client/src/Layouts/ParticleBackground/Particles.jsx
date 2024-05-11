// Particles.js
import React, { useEffect } from 'react';
import styles from './Particles.module.css';
import particlesConfig from './particlesConfig';

const Particles = () => {
  useEffect(() => {
    window.particlesJS('particles-js', particlesConfig);

    return () => {
      // Clean up particles.js when component unmounts
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom.forEach(pJS => pJS.pJS.fn.vendors.destroypJS());
        window.pJSDom = [];
      }
    };
  }, []);

  return (
    <div id="particles-js" className={styles.particles} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>

    </div>
  );
};

export default Particles;
