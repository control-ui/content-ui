import { extractHeaders, headersJson, useApi } from 'react-api-fetch'
import { FetcherFetchMethod } from 'react-api-fetch/fetcher'


export type ApiConnect<D = {}, HR = {}> =
    <D1 extends D = D>(
        url: string,
        method?: FetcherFetchMethod,
        data?: any,
        reqHeaders?: HeadersInit,
    ) => Promise<{
        data: D1
        code: number
    } & HR>

export const useAppApi = (): ApiConnect => {
    return useApi({
        // bearer: appToken ? 'Bearer ' + appToken : undefined,
        extractHeaders: extractHeaders,
        headers: headersJson,
    })
}
