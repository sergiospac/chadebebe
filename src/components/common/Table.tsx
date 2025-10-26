import React from 'react';
import styled from 'styled-components';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  border-radius: 4px;
  
  &.edit {
    color: #17a2b8;
    
    &:hover {
      background-color: rgba(23, 162, 184, 0.1);
    }
  }
  
  &.delete {
    color: #dc3545;
    
    &:hover {
      background-color: rgba(220, 53, 69, 0.1);
    }
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-style: italic;
  color: #6c757d;
`;

function Table<T extends { id?: number }>({ columns, data, loading, onEdit, onDelete }: TableProps<T>) {
  if (loading) {
    return (
      <TableContainer>
        <LoadingOverlay>Carregando...</LoadingOverlay>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer>
        <LoadingOverlay>Nenhum registro encontrado.</LoadingOverlay>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHeader>
          <tr>
            {columns.map((column, index) => (
              <TableHeaderCell key={index}>{column.header}</TableHeaderCell>
            ))}
            {(onEdit || onDelete) && <TableHeaderCell>Ações</TableHeaderCell>}
          </tr>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : (item[column.accessor] as React.ReactNode)}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  {onEdit && (
                    <ActionButton
                      className="edit"
                      onClick={() => onEdit(item)}
                      title="Editar"
                    >
                      ✏️ Editar
                    </ActionButton>
                  )}
                  {onDelete && (
                    <ActionButton
                      className="delete"
                      onClick={() => onDelete(item)}
                      title="Excluir"
                    >
                      🗑️ Excluir
                    </ActionButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}

export default Table; 