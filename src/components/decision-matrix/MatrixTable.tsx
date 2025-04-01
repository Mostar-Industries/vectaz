
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MatrixTableProps {
  rows: number[][];
  columnCount: number;
}

const MatrixTable: React.FC<MatrixTableProps> = ({ rows, columnCount }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No matrix data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Row/Col</TableHead>
            {Array.from({ length: columnCount }).map((_, idx) => (
              <TableHead key={`col-${idx}`}>Column {idx + 1}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={`row-${rowIdx}`}>
              <TableCell className="font-medium">Row {rowIdx + 1}</TableCell>
              {row.map((cell, cellIdx) => (
                <TableCell key={`cell-${rowIdx}-${cellIdx}`}>{cell.toFixed(3)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatrixTable;
