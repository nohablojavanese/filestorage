import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Skeleton } from "@nextui-org/react";

const SkeletonList = () => {
  return (
    <Table aria-label="File list loading skeleton">
    <TableHeader>
      <TableColumn>NAME</TableColumn>
      <TableColumn>SIZE</TableColumn>
      <TableColumn>CREATED AT</TableColumn>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-3 w-3/4 rounded-lg"/></TableCell>
          <TableCell><Skeleton className="h-3 w-1/4 rounded-lg"/></TableCell>
          <TableCell><Skeleton className="h-3 w-1/2 rounded-lg"/></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
}

export default SkeletonList