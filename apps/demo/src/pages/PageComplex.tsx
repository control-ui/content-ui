import { ContentParserExtended } from '@content-ui/md/parser/ContentParserExtended'
import { SettingsProvider } from '@content-ui/react/LeafSettings'
import Paper from '@mui/material/Paper'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import Grid2 from '@mui/material/Unstable_Grid2'
import { ps, useProgress } from 'react-progress-state'
import { useAppApi } from '../lib/useAppApi'
import { config } from '../config'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { ApiPing } from '../components/ApiPing'
import IcRefresh from '@mui/icons-material/Refresh'
import { IconButtonProgress } from '@ui-controls/progress/IconButtonProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { ViewerFromText } from '@content-ui/react/ViewerFromText'

export const PageComplex: React.ComponentType = () => {
    const {t} = useTranslation('translation')
    const [content, setContent] = React.useState<string>('')
    const [contentList, setContentList] = React.useState<{ files: { name: string }[] } | undefined>(undefined)
    const [contentDetails, setContentDetails] = React.useState<any | undefined>(undefined)
    const [loading, setLoading, startLoading] = useProgress()
    const [loadingDetails, setLoadingDetails, startLoadingDetails] = useProgress()
    const fetch = useAppApi()

    const load = React.useCallback(() => {
        const pid = startLoading()
        fetch<{ files: { name: string }[] }>(config.API_HOST + '/contents')
            .then((r) => {
                const isPid = setLoading(ps.done, undefined, pid)
                if(!isPid) return
                setContentList(r.data)
            })
            .catch((e) => {
                const isPid = setLoading(ps.error, e, pid)
                if(!isPid) return
            })
    }, [fetch, setContentList, startLoading, setLoading])

    const loadDetails = React.useCallback((contentId: string) => {
        const pid = startLoadingDetails()
        fetch<{}>(config.API_HOST + '/contents/' + contentId)
            .then((r) => {
                const isPid = setLoadingDetails(ps.done, undefined, pid)
                if(!isPid) return
                setContentDetails(r.data)
            })
            .catch((e) => {
                const isPid = setLoadingDetails(ps.error, e, pid)
                if(!isPid) return
            })
    }, [fetch, setContentDetails, startLoadingDetails, setLoadingDetails])

    React.useEffect(() => {
        load()
    }, [load])

    React.useEffect(() => {
        if(!content) return
        loadDetails(content)
    }, [loadDetails, content])

    return <>
        <Helmet>
            <title>{t('brand')} · Content-UI</title>
        </Helmet>

        <Container maxWidth={'lg'} fixed>
            <Box mt={1}>
                <Paper sx={{px: 1.5, py: 1}}>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} sx={{display: 'flex'}}>
                            <FormControl fullWidth size={'small'} sx={{mr: 1}}>
                                <InputLabel id="content-selector">Content</InputLabel>
                                <Select
                                    label={'Content'} size={'small'}
                                    labelId="content-selector"
                                    id="content-selector-v"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                >
                                    {contentList?.files.map(file =>
                                        <MenuItem value={file.name} key={file.name}>{file.name}</MenuItem>,
                                    )}
                                </Select>
                            </FormControl>
                            <IconButtonProgress
                                tooltip={'Refresh'}
                                progress={loading.progress}
                                onClick={() => {
                                    load()
                                    if(!content) return
                                    loadDetails(content)
                                }}
                            >
                                <IcRefresh/>
                            </IconButtonProgress>
                        </Grid2>

                        {loading.progress === ps.start || loadingDetails.progress === ps.start ?
                            <LinearProgress/> : null}

                        {loading.progress === ps.error ?
                            <Grid2 xs={12}>
                                <Alert severity={'error'}>
                                    <AlertTitle>Failed to load content list.</AlertTitle>
                                </Alert>
                            </Grid2> : null}
                        {content && loadingDetails.progress === ps.error ?
                            <Grid2 xs={12}>
                                <Alert severity={'error'}>
                                    <AlertTitle>Failed to load content details for <code>{content}</code>.</AlertTitle>
                                </Alert>
                            </Grid2> : null}

                        {contentDetails?.file ?
                            <Grid2 xs={12}>
                                <SettingsProvider
                                    headlineLinkable
                                    headlineSelectable
                                    headlineSelectableOnHover
                                >
                                    <ViewerFromText
                                        Viewer={ViewerBoxRouter}
                                        processor={ContentParserExtended}
                                        textValue={contentDetails.file}
                                        parseDelay={0}
                                        onMount
                                    />
                                </SettingsProvider>
                            </Grid2> : null}

                        <Grid2 xs={12} md={8} mdOffset={2}>
                            <ApiPing/>
                        </Grid2>
                    </Grid2>
                </Paper>
            </Box>
        </Container>
    </>
}
