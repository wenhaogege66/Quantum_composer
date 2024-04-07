import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

export default function LeftDrawer() {
  const drawerWidth = 60;
  const icon = (index: number) => {
    switch(index) {
      case 0:
        return <FolderOpenIcon />;
      case 1:
        return <FlipCameraAndroidIcon />;
      default:
        return <IntegrationInstructionsIcon />;
    }
  }
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        {['File', 'Job', 'Doc'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {icon(index)}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}