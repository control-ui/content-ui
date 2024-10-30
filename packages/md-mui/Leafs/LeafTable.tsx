import React from 'react'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import type { Table as MdTable/* TableRow as MdTableRow, TableCell as MdTableCell*/ } from 'mdast'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { useTheme } from '@mui/material/styles'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafTable: React.FC<ContentLeafProps<'table'>> = ({child}) => {
    const c = child as MdTable
    // todo: align exists on table level, not on cell level
    //const align = c.align
    const headerRow = c.children.slice(0, 1)
    const contentRows = c.children.slice(1)
    return <Table
        size={'small'}
        sx={{
            mt: 1,
            mb: 3,
        }}
    >
        <TableHead>
            <LeafChildNodes childNodes={headerRow}/>
        </TableHead>
        <TableBody>
            <LeafChildNodes<{ tableSettings?: any }>
                childNodes={contentRows}
                //tableSettings={{align}}
            />
            {/*contentRows.map((childNext, i) =>
                <ContentLeaf
                    key={i}
                    elem={childNext.type}
                    child={childNext}
                    selected={isLeafSelected(childNext.position, editorSelection?.startLine, editorSelection?.endLine)}
                    isFirst={i === 0}
                    isLast={i === length - 1}
                    //{...p as unknown as P}
                />)*/}
        </TableBody>
    </Table>
}

export const LeafTableRow: React.FC<ContentLeafProps<'tableRow'>> = ({child, selected, ...props}) => {
    const rRef = useLeafFollower<HTMLTableRowElement>(selected)
    return <TableRow ref={rRef}>
        <LeafChildNodes childNodes={child.children} {...props}/>
    </TableRow>
}

export const LeafTableCell: React.FC<ContentLeafProps<'tableCell'> & { tableSettings?: any }> = ({child, selected, ...props}) => {
    const {palette} = useTheme()
    // const c = child as MdTableCell
    // todo: add gfm-advanced support
    return <TableCell
        // todo: this needs to know the cell index
        // align={tableSettings?.align[cellNo] || c.data?.align as TableCellProps['align']}
        // align={c.data?.align as TableCellProps['align']}
        style={{
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
        }}
    >
        <LeafChildNodes childNodes={child.children} {...props}/>
    </TableCell>
}
