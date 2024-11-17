/**
 * @jest-environment jsdom
 */
import { LeafHRouter } from '@content-ui/md-mui/Leafs/LeafHRouter'
import { MuiLink } from '@content-ui/md-mui/MuiComponents/MuiLink'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeafsContext'
import { it, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { render } from '@testing-library/react'
import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { ViewerContent } from '@content-ui/md-mui/ViewerContent'
import { ViewerFromText } from '@content-ui/react/ViewerFromText'
import { BrowserRouter } from 'react-router-dom'

// npm run test -- --testPathPattern=ViewerFrom --no-cache
// rm -rf node_modules/.cache && npm run test -- --testPathPattern=ViewerFrom --no-cache
// rm -rf node_modules && npm i && npm run test -- --testPathPattern=ViewerFrom --no-cache

describe('ViewerFromText', () => {
    it('Headline', async() => {
        const mdHeadline = '# Headline 1'
        const {queryByText} = render(
            <ContentLeafsProvider deco={contentUIDecorators} renderMap={renderMapping}>
                <ViewerFromText
                    Viewer={ViewerContent}
                    processor={ContentParser}
                    textValue={mdHeadline}
                    onMount
                />
            </ContentLeafsProvider>,
        )
        expect(queryByText('Headline 1')).toBeInTheDocument()
    })

    it('With Router Headline', async() => {
        const mappingsWithLink: typeof renderMapping = {
            ...renderMapping,
            leafs: {
                ...renderMapping.leafs,
                heading: LeafHRouter,
            },
            components: {
                ...renderMapping.components,
                Link: MuiLink,
            },
        }
        const mdHeadline = '# Headline 1'
        const {queryByText} = render(
            <BrowserRouter>
                <ContentLeafsProvider deco={contentUIDecorators} renderMap={mappingsWithLink}>
                    <ViewerFromText
                        Viewer={ViewerContent}
                        processor={ContentParser}
                        textValue={mdHeadline}
                        onMount
                    />
                </ContentLeafsProvider>
            </BrowserRouter>,
        )
        expect(queryByText('Headline 1')).toBeInTheDocument()
    })
})
