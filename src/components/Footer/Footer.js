import React from 'react';
import { Link, Typography } from '@material-ui/core';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <ul>
          <li>
            <Link>
              <Typography variant='subtitle2'>About</Typography>
            </Link>
          </li>
          <li>
            <Link>
              <Typography variant='subtitle2'>Help</Typography>
            </Link>
          </li>
          <li>
            <Link>
              <Typography variant='subtitle2'>Privacy</Typography>
            </Link>
          </li>
          <li>
            <Link>
              <Typography variant='subtitle2'>Terms</Typography>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Typography variant='subtitle2' color='textSecondary'>
          &copy;2020 IDREAMM INC
        </Typography>
      </div>
    </footer>
  );
}
