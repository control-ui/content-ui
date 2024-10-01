/**
 * @jest-environment jsdom
 */
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeaf'
import { it, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { render } from '@testing-library/react'
import { contentUIMapping } from '../src/components/ContentUI'
import { PageHome } from '../src/pages/PageHome'

describe('PageHome', () => {
    // it('DummyText', async() => {
    //     const {queryByText} = render(
    //         <span>{'PageHome'}</span>,
    //     )
    //     expect(queryByText('PageHome')).toBeInTheDocument()
    // })

    it('PageHome Content', async() => {
        const {queryByText} = render(
            <ContentLeafsProvider deco={contentUIDecorators} renderMap={contentUIMapping}>
                <PageHome/>
            </ContentLeafsProvider>,
        )
        expect(queryByText('Content-UI Demo')).toBeInTheDocument()
    })
})
