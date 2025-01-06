import { useSettings } from '@content-ui/react/LeafSettings'
import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import YAML from 'yaml'
import IcDataObject from '@mui/icons-material/DataObject'
import IcView from '@mui/icons-material/Visibility'
import IcViewOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import { ContentLeafProps, ContentLeafsPropsMapping, useContentLeafs } from '@content-ui/react/ContentLeafsContext'
import type { MuiContentRenderComponents } from '@content-ui/md-mui/LeafsComponents'

export const LeafYaml: FC<ContentLeafProps<'yaml'> & { dense?: boolean }> = ({child, dense}) => {
    const [showData, setShowData] = useState(false)
    const {fmHide} = useSettings()
    const {renderMap: {components}} = useContentLeafs<ContentLeafsPropsMapping, MuiContentRenderComponents>()

    const parsedData = React.useMemo(() => {
        if(!child || ((child.value?.trim() || '') === '')) return undefined
        try {
            return YAML.parse(child.value, {prettyErrors: true})
        } catch(e) {
            console.error('yaml error', child, e)
            return undefined
        }
    }, [child])

    if(
        (
            typeof fmHide === 'string' ?
                fmHide === 'always' ||
                (fmHide === 'first' && child.position?.start?.line === 1) : false
        )
        || (
            typeof fmHide === 'function' ? fmHide(child) : false
        )
    ) return null

    const Code = components.Code
        // eslint-disable-next-line deprecation/deprecation
        || components.CodeMirror

    return <Box mt={1} mb={2}>
        <Button
            startIcon={showData ? <IcViewOff/> : <IcView/>}
            endIcon={<IcDataObject/>}
            onClick={() => setShowData(s => !s)}
            size={'small'} variant={'outlined'} color={parsedData ? 'secondary' : 'error'}
        >Inline Data</Button>

        <Collapse in={showData} mountOnEnter>
            <Box mt={1}>
                {Code ?
                    <Code
                        value={child.value}
                        lang={'yaml'}
                        dense={dense}
                    /> :
                    <pre><code>{child.value}</code></pre>}
            </Box>
        </Collapse>
    </Box>
}
