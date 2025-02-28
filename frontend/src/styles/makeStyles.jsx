import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  paper: {
    padding: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  paperLight: {
    backgroundColor: 'white',
    color: 'black',
  },
  paperDark: {
    backgroundColor: '#555',
    color: 'white',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  headingDark: {
    color: 'white',
  },
});

export default useStyles;
