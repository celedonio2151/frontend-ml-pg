import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { users } from 'modules/public/data/waterShowcaseData';
import { toneByRole, toneByStatus } from './waterShowcaseTones';

function UsersPreviewTable() {
  return (
    <AquaPanel liquid sx={{ p: 0 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>CI</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.ci} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.dark' }}>{user.name.slice(0, 1)}</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{user.ci}</TableCell>
                <TableCell>
                  <StatusPill label={user.role} tone={toneByRole[user.role]} />
                </TableCell>
                <TableCell>
                  <StatusPill label={user.status} tone={toneByStatus[user.status]} pulse={user.status === 'Activo'} />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary">
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error">
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AquaPanel>
  );
}

export default UsersPreviewTable;
