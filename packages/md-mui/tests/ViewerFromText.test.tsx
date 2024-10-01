/**
 * @jest-environment jsdom
 */
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeaf'
import { it, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { render } from '@testing-library/react'
import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { ViewerFromText } from '@content-ui/md-mui/Viewer'
import { BrowserRouter } from 'react-router-dom'

// npm run test -- --testPathPattern=ViewerFrom --no-cache
// rm -rf node_modules/.cache && npm run test -- --testPathPattern=ViewerFrom --no-cache

describe('ViewerFromText', () => {
    it('Headline', async() => {
        const mdHeadline = '# Headline 1'
        const {queryByText} = render(
            <BrowserRouter>
                <ContentLeafsProvider deco={contentUIDecorators} renderMap={renderMapping}>
                    <ViewerFromText processor={ContentParser} textValue={mdHeadline} onMount/>
                </ContentLeafsProvider>
            </BrowserRouter>,
        )
        expect(queryByText('Headline 1')).toBeInTheDocument()
    })
})
