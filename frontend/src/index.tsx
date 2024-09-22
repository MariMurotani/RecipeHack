import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@mui/material';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, React with TypeScript and MUI!</h1>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
