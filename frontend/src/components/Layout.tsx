import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Layout: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuClick = (event:any) => {
    console.log(event);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* ヘッダー */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Food Paring App
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button
            color="inherit"
            onClick={handleMenuClick}
            endIcon={<KeyboardArrowDownIcon />} // 矢印アイコンを右側に追加
          >
            Analytics
          </Button>
          <Button color="inherit" component={Link} to="/about">About</Button>

          
          {/* サブメニュー */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
          <MenuItem component={Link} to="/centrality_analytics" onClick={handleMenuClose}>
            <AnalyticsIcon />Aromaの中央性分析
          </MenuItem>
          <MenuItem component={Link} to="/feature2" onClick={handleMenuClose}>Feature 2</MenuItem>
          <MenuItem component={Link} to="/feature3" onClick={handleMenuClose}>Feature 3</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ページごとのコンテンツがここに表示される */}
      <Outlet />
    </>
  );
};

export default Layout;
