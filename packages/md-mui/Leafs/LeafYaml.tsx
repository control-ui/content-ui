import React from 'react'
import Box from '@mui/material/Box'
import YAML from 'yaml'
import IcDataObject from '@mui/icons-material/DataObject'
import IcView from '@mui/icons-material/Visibility'
import IcViewOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import { ContentLeafProps, ContentLeafsPropsMapping, useContentLeafs } from '@content-ui/react/ContentLeaf'
import { MuiContentRenderComponents } from '@content-ui/md-mui/LeafsMarkdown'

export const LeafYaml: React.FC<ContentLeafProps> = ({child}) => {
    const [showData, setShowData] = React.useState(false)
    const yml = child.type === 'yaml' ? child : undefined
    const {renderMap: {components}} = useContentLeafs<ContentLeafsPropsMapping, MuiContentRenderComponents>()

    const parsedData = React.useMemo(() => {
        if(!yml || ((yml.value?.trim() || '') === '')) return undefined
        try {
            return YAML.parse(yml.value, {prettyErrors: true})
        } catch(e) {
            console.error('yaml error', yml, e)
            return undefined
        }
    }, [yml])

    if(!yml) return null

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
                        value={yml.value}
                        lang={'yaml'}
                    /> :
                    <pre><code>{yml.value}</code></pre>}
            </Box>
        </Collapse>
    </Box>
}
