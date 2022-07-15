import * as React from 'react';
import {
  CssBaseline,
  Box,
  AppBar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  DialogContentText,
} from '@mui/material';

import { Add, ArrowBack, Delete, Edit, Menu as MenuIcon } from '@mui/icons-material';

import { API } from '../src/api';
import { User } from '../src/types';
import UserList from '../src/UserList';

const drawerWidth = 200;

interface State {
  updated: boolean;
}

interface Props {
  window?: () => Window;
  users: User[];
}

type FormData = User & State;

export default function Home({ window, users: initialUsers }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const [selectedElement, setSelectedElement] = React.useState<FormData | undefined>();
  const [users, setUsers] = React.useState<User[]>(initialUsers || []);
  const client = new API();

  const container = window !== undefined ? () => window().document.body : undefined;

  const emailRegexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  const handleFetchUsers = async () => {
    const data = await client.getUsers();
    setUsers(data || []);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBackClick = () => {
    setSelectedElement(undefined);
    setMobileOpen(!mobileOpen);
  };

  const handleEditClick = () => {
    setMobileOpen(!mobileOpen);
    setOpenDialog(true);
  };

  const handleDeleteClick = () => {
    setMobileOpen(!mobileOpen);
    setOpenConfirm(true);
  };

  const handleChangeName = (value: string) => {
    setSelectedElement({ ...selectedElement, name: value, updated: true });
  };

  const handleChangeEmail = (value: string) => {
    setSelectedElement({ ...selectedElement, email: value, updated: true });
  };

  const handleClickOpen = () => {
    setMobileOpen(!mobileOpen);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedElement(undefined);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirm = async () => {
    setOpenConfirm(false);
    setSelectedElement(undefined);
    await client.deleteUser(selectedElement?.id as number);
    await handleFetchUsers();
  };

  const handleSubmit = async () => {
    setOpenDialog(false);
    if (selectedElement?.id) {
      await client.updateUser(
        selectedElement?.id as number,
        selectedElement?.name as string,
        selectedElement?.email as string,
      );
    } else {
      await client.createUser(selectedElement?.name as string, selectedElement?.email as string);
    }
    await handleFetchUsers();
  };

  const handleUserClick = (user: User) => {
    setSelectedElement({ ...user } as FormData);
    setMobileOpen(!mobileOpen);
  };

  const validateName = selectedElement?.name && selectedElement?.name !== '';
  const validateEmail =
    selectedElement?.email && selectedElement?.email !== '' && emailRegexp.test(selectedElement?.email);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant='h6' noWrap component='div'>
          Test
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {!Boolean(selectedElement?.id) && (
          <ListItem key={'create'} onClick={handleClickOpen} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary={'Create'} />
            </ListItemButton>
          </ListItem>
        )}
        {Boolean(selectedElement?.id) && (
          <>
            <ListItem key={'back'} onClick={handleBackClick} disablePadding sx={{ marginBottom: 1 }}>
              <ListItemButton>
                <ListItemIcon>
                  <ArrowBack />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key={'edit'} onClick={handleEditClick} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText primary={'Edit'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'delete'} onClick={handleDeleteClick} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Delete />
                </ListItemIcon>
                <ListItemText primary={'Delete'} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Dialog key='form' open={openDialog} onClose={handleClose}>
        <DialogTitle>{selectedElement?.id ? 'Update User ' + selectedElement?.id : 'Create User'}</DialogTitle>
        <DialogContent>
          <FormControl></FormControl>
          <TextField
            required={true}
            error={selectedElement?.updated && !validateName}
            value={selectedElement?.name}
            autoFocus
            id='name'
            label='Name'
            onChange={e => handleChangeName(e?.target.value)}
            type='text'
            fullWidth
            sx={{ marginBottom: 2, marginTop: 1 }}
          />
          <TextField
            required={true}
            error={selectedElement?.updated && !validateEmail}
            value={selectedElement?.email}
            id='email'
            type='email'
            label='Email Address'
            onChange={e => handleChangeEmail(e?.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!validateName || !validateEmail}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog key='confirm' open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Removing user {selectedElement?.name || ''} ({selectedElement?.email || ''})
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Items
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component='main' sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <UserList users={users} onUserClick={handleUserClick} selectedId={selectedElement?.id} />
      </Box>
    </Box>
  );
}

// Prerender data on server
export async function getServerSideProps() {
  const endpoint = process.env.API_ENDPOINT;
  const client = new API(endpoint);

  try {
    const users = await client.getUsers();
    return { props: { users } };
  } catch (e) {
    return { props: { users: [] } };
  }
}
