'use client';
import * as React from 'react';
import styles from './Particles.module.css';
import particlesConfig from './particles-config';

export default function Particles(): React.JSX.Element {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      import('particles.js').then((particlesJS) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- particlesJS is a global function
        window.particlesJS('particles-js', particlesConfig);
      });

      return () => {
        // Clean up particles.js when component unmounts
        if (window.pJSDom && window.pJSDom.length) {
          window.pJSDom.forEach(pJS => pJS.pJS.fn.vendors.destroypJS());
          window.pJSDom = [];
        }
      };
    }
  }, []);

  return (
    <div
      id="particles-js"
      className={styles.particles}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
