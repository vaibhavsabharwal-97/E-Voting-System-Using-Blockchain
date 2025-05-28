import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  alpha,
  useTheme,
  Fade,
  Zoom,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.default, 0.05)
      : alpha(theme.palette.background.paper, 0.05),
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.primary.main, 0.04),
  },
  '&:last-child td, &:last-child th': { 
    border: 0 
  },
  transition: 'background-color 0.2s ease',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderColor: alpha(theme.palette.divider, 0.7),
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '&.MuiTableSortLabel-root:hover': {
    color: theme.palette.primary.main,
  },
  '&.Mui-active': {
    color: theme.palette.primary.main,
    '& .MuiTableSortLabel-icon': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

const StyledFilterChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 500,
  '&.MuiChip-outlined': {
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  '&.MuiChip-filled': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, filterField) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  
  if (query && filterField) {
    return array.filter((item) => {
      const value = item[filterField];
      if (typeof value === 'string') {
        return value.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      }
      if (typeof value === 'number') {
        return value.toString().indexOf(query) !== -1;
      }
      return false;
    });
  }
  
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = ({ columns, order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.id}
            align={column.align || 'left'}
            sortDirection={orderBy === column.id ? order : false}
            sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {column.sortable !== false ? (
              <StyledTableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </StyledTableSortLabel>
            ) : (
              column.label
            )}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableToolbar = ({ title, searchValue, onSearchChange, onRefresh, filterField, setFilterField, filterOptions }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  
  const handleFilterSelect = (value) => {
    setFilterField(value);
    handleFilterClose();
  };
  
  return (
    <Toolbar
      sx={{
        pl: { sm: 3 },
        pr: { xs: 2, sm: 3 },
        py: 2.5,
        backgroundColor: theme.palette.mode === 'light' 
          ? alpha(theme.palette.primary.main, 0.04)
          : alpha(theme.palette.primary.dark, 0.1),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%', fontWeight: 600 }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      
      {filterOptions && (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap', mr: 2 }}>
          {filterOptions.map((option) => (
            <StyledFilterChip 
              key={option.value}
              label={option.label}
              onClick={() => setFilterField(option.value)}
              color="primary"
              variant={filterField === option.value ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      )}
      
      {filterOptions && (
        <Box sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}>
          <Button
            id="filter-button"
            aria-controls={open ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFilterClick}
            endIcon={<KeyboardArrowDownIcon />}
            startIcon={<FilterListIcon />}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 20 }}
          >
            Filter
          </Button>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleFilterClose}
            MenuListProps={{
              'aria-labelledby': 'filter-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {filterOptions.map((option) => (
              <MenuItem 
                key={option.value} 
                onClick={() => handleFilterSelect(option.value)}
                selected={filterField === option.value}
              >
                {filterField === option.value && (
                  <ListItemIcon>
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText 
                  inset={filterField !== option.value}
                  primary={option.label} 
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      <StyledSearchField
        size="small"
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ marginRight: 2, width: { xs: '100%', sm: 200 } }}
      />

      {onRefresh && (
        <Tooltip title="Refresh" arrow>
          <IconButton 
            onClick={onRefresh}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const EnhancedTable = ({
  title = 'Table',
  columns = [],
  data = [],
  defaultOrderBy = columns[0]?.id || 'id',
  defaultOrder = 'asc',
  onRowClick,
  searchPlaceholder = 'Search...',
  filterOptions,
  defaultFilterField = filterOptions?.[0]?.value || '',
  renderCell,
  onRefresh,
  emptyContent = 'No data found',
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [filterField, setFilterField] = useState(defaultFilterField);
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  const filteredData = applySortFilter(data, getComparator(order, orderBy), searchValue, filterField);
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isDataEmpty = filteredData.length === 0;

  return (
    <Box sx={{ width: '100%' }}>
      <EnhancedTableToolbar 
        title={title} 
        searchValue={searchValue} 
        onSearchChange={handleSearchChange} 
        onRefresh={onRefresh}
        filterField={filterField}
        setFilterField={setFilterField}
        filterOptions={filterOptions}
      />
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
          stickyHeader
        >
          <EnhancedTableHead
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {isDataEmpty ? (
              <TableRow>
                <StyledTableCell align="center" colSpan={columns.length} sx={{ py: 6 }}>
                  <Fade in={true} timeout={500}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" color="text.secondary" fontWeight={500}>
                        {emptyContent}
                      </Typography>
                      {onRefresh && (
                        <Button 
                          startIcon={<RefreshIcon />} 
                          onClick={onRefresh}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Refresh
                        </Button>
                      )}
                    </Box>
                  </Fade>
                </StyledTableCell>
              </TableRow>
            ) : (
              <Fade in={true} timeout={500}>
                <TableBody>
                  {paginatedData.map((row, index) => {
                    return (
                      <StyledTableRow
                        hover
                        onClick={() => onRowClick && onRowClick(row)}
                        key={row.id || index}
                        sx={{ 
                          cursor: onRowClick ? 'pointer' : 'default',
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <StyledTableCell key={column.id} align={column.align || 'left'}>
                              {renderCell ? renderCell(column.id, value, row) : value}
                            </StyledTableCell>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Fade>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ 
          borderTop: 1, 
          borderColor: 'divider',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.875rem',
          },
          '& .MuiTablePagination-select': {
            paddingY: 1,
          }
        }}
      />
    </Box>
  );
};

export default EnhancedTable; 