import React from 'react'
import { BaseLeafContent } from '@content-ui/md-mui/Leafs/BaseLeafContent'
import { Table as MdTable,/* TableRow as MdTableRow,*/ TableCell as MdTableCell } from 'mdast'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { TableCellProps } from '@mui/material/TableCell/TableCell'
import TableBody from '@mui/material/TableBody'
import { useTheme } from '@mui/material/styles'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafTable: React.FC<ContentLeafProps> = ({child}) => {
    const c = child as MdTable
    const headerRow = c.children.slice(0, 1)
    const contentRows = c.children.slice(1)
    return <Table size={'small'} sx={{mt: 1, mb: 3}}>
        <TableHead>
            <BaseLeafContent child={{children: headerRow}}/>
        </TableHead>
        <TableBody>
            <BaseLeafContent child={{children: contentRows}}/>
        </TableBody>
    </Table>
}

export const LeafTableRow: React.FC<ContentLeafProps> = ({child, selected}) => {
    const rRef = useLeafFollower<HTMLTableRowElement>(selected)
    return <TableRow ref={rRef}>
        {child.type === 'tableRow' ?
            <BaseLeafContent child={child}/> : null}
    </TableRow>
}

export const LeafTableCell: React.FC<ContentLeafProps> = ({child, selected}) => {
    const {palette} = useTheme()
    const c = child as MdTableCell
    // todo: add gfm-advanced support
    return <TableCell
        align={c.data?.align as TableCellProps['align']}
        style={{
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
        }}
    >
        {child.type === 'tableCell' ?
            <BaseLeafContent child={child}/> : null}
    </TableCell>
}
