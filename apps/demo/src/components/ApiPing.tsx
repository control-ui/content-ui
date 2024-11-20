import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { config } from '../config'
import { useAppApi } from '../lib/useAppApi'
import { ButtonProgress } from '@ui-controls/progress/ButtonProgress'
import { ps, useProgress } from 'react-progress-state/useProgressNext'
import { CustomCodeMirror } from './CustomCodeMirror'
import { json } from '@codemirror/lang-json'

export const ApiPing: React.ComponentType = () => {
    const [ping, setPing] = React.useState<any>(undefined)
    const [loading, setLoading, startLoading] = useProgress()
    const fetch = useAppApi()
    const extensions = React.useMemo(() => [json()], [])

    return <Paper
        style={{
            borderRadius: 6,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
        }}
        variant={'outlined'}
    >
        <ButtonProgress
            progress={loading.progress}
            size={'large'} color={'info'}
            onClick={() => {
                const pid = startLoading()
                fetch(config.API_HOST + '/ping')
                    .then(r => {
                        const isPid = setLoading(ps.success, undefined, pid)
                        if(!isPid) return
                        setPing(r.data)
                    })
                    .catch(e => {
                        const isPid = setLoading(ps.error, e, pid)
                        if(!isPid) return
                        setPing(e)
                    })
            }}
        >Ping API</ButtonProgress>
        {ping ? <Box style={{overflow: 'auto'}}>
            <CustomCodeMirror
                extensions={extensions}
                value={JSON.stringify(ping, undefined, 4)}
                variant={'embed'}
            />
        </Box> : null}
    </Paper>
}
