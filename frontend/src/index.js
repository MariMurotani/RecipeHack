import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@mui/material';
var App = function () {
    return (React.createElement("div", null,
        React.createElement("h1", null, "Hello, React with TypeScript and MUI!"),
        React.createElement(Button, { variant: "contained", color: "primary" }, "Click Me")));
};
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
