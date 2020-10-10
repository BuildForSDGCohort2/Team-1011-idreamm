import React, { useEffect, useState } from 'react';
import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import styles from './Quotes.module.css';

const useStyles = makeStyles({
  quote: {
    fontStyle: 'italic',
  },
});

export default function Quotes() {
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    let quoteInterval;
    fetch('https://type.fit/api/quotes')
      .then((response) => response.json())
      .then((quotes) => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setIsLoading(false);
        quoteInterval = setInterval(() => {
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          setQuote(randomQuote);
        }, 30000);
      })
      .catch((err) => {
        setIsLoading(false);
      });

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loader__container}>
          <CircularProgress color='secondary' size={16} />
          <Typography variant='body2' color='textSecondary'>
            Getting quote
          </Typography>
        </div>
      ) : (
        <>
          <Typography
            align='justify'
            className={classes.quote}
            color='textSecondary'
          >
            {quote && quote.text}
          </Typography>
          <Typography color='textSecondary' align='right' variant='subtitle2'>
            - {(quote && quote.author) || 'Anonymous'}
          </Typography>
        </>
      )}
    </div>
  );
}
