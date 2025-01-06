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
import { FC, createContext, PropsWithChildren, useContext, useMemo } from 'react'

export type TableSettings = {
    align: MdTable['align']
}

const TableSettingsContext = createContext<TableSettings>({
    align: undefined,
})

export const useTableSettings = (): TableSettings => useContext(TableSettingsContext)

export const TableSettingsProvider = (
    {
        children,
        align,
    }: PropsWithChildren<TableSettings>,
) => {
    const ctx = useMemo(() => {
        return {
            align,
        }
    }, [
        align,
    ])

    return <TableSettingsContext.Provider value={ctx}>{children}</TableSettingsContext.Provider>
}


export const LeafTable: FC<ContentLeafProps<'table'>> = ({child}) => {
    console.log('child-t', child)
    // todo: align exists on table level, not on cell level
    //const align = c.align
    const headerRow = child.children.slice(0, 1)
    const contentRows = child.children.slice(1)
    return <Table
        size={'small'}
        sx={{
            mt: 1,
            mb: 3,
        }}
    >
        <TableSettingsProvider
            align={child.align}
        >
            <TableHead>
                <LeafChildNodes
                    childNodes={headerRow}
                />
            </TableHead>
            <TableBody>
                <LeafChildNodes
                    childNodes={contentRows}
                />
            </TableBody>
        </TableSettingsProvider>
    </Table>
}

export const LeafTableRow: FC<ContentLeafProps<'tableRow'>> = ({child, selected, ...props}) => {
    const rRef = useLeafFollower<HTMLTableRowElement>(selected)
    return <TableRow ref={rRef}>
        <LeafChildNodes
            childNodes={child.children}
            {...props}
            addIndex
        />
    </TableRow>
}

export const LeafTableCell: FC<ContentLeafProps<'tableCell'> & { tableSettings?: any }> = ({child, selected, index, ...props}) => {
    const {palette} = useTheme()
    const {align} = useTableSettings()
    const cellAlign = typeof index === 'number' && align ? align[index] : undefined
    // todo: add gfm-advanced support
    return <TableCell
        align={cellAlign || undefined}
        style={{
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
        }}
    >
        <LeafChildNodes childNodes={child.children} {...props}/>
    </TableCell>
}
