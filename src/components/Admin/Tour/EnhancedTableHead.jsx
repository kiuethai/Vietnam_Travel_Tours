/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState, useRef } from 'react'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { Typography } from '~/components/Admin/Wrappers/Wrappers'


const Resizable = ({ children, onResize, width }) => {
  const [isResizing, setIsResizing] = useState(false);
  const initialX = useRef(0);
  const initialWidth = useRef(0);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    initialX.current = e.clientX;
    initialWidth.current = width;
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const diff = e.clientX - initialX.current;
      const newWidth = Math.max(50, initialWidth.current + diff); // Minimum width of 50px
      onResize(newWidth);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div style={{ position: 'relative', width: `${width}px` }}>
      {children}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          cursor: 'col-resize',
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
    columnWidths,
    onColumnResize,
    headCells
  } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'right'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              width: columnWidths[headCell.id] || defaultColumnWidths[headCell.id],
              paddingLeft: 8,
              paddingRight: 8
            }}
          >
            <Resizable
              width={columnWidths[headCell.id] || defaultColumnWidths[headCell.id]}
              onResize={(width) => onColumnResize(headCell.id, width)}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography
                  noWrap
                  weight={'medium'}
                  variant={'body2'}
                >
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            </Resizable>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead