import { Person } from '@mui/icons-material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { User } from './types';

interface Props {
  users: User[];
  selectedId?: number;
  onUserClick: (user: User) => void;
}

const UserList: React.FC<Props> = ({ users = [], onUserClick, selectedId }) => {
  const handleClick = (u: User) => {
    onUserClick && onUserClick(u);
  };

  return (
    <List>
      {users.length === 0 && (
        <ListItem key={'empty'} disabled={true}>
          <ListItemText secondary={'No users'} />
        </ListItem>
      )}
      {Array.isArray(users) &&
        users.length !== 0 &&
        users.map((u: User) => (
          <ListItem key={u.id} sx={{ cursor: 'pointer' }} onClick={() => handleClick(u)} selected={u.id == selectedId}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary={u.name} secondary={u.email} />
          </ListItem>
        ))}
    </List>
  );
};

export default UserList;
