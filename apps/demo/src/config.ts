const appConfig = JSON.parse((document.querySelector('script[data-config="app"]') as HTMLScriptElement)?.innerText || '{}')

export const config: {
    VERSION: string
    API_HOST: string
    BASE_PATH: string
} = {
    VERSION: process.env.REACT_APP_ENV as string + (process.env.REACT_APP_VERSION ? '#' + process.env.REACT_APP_VERSION : ''),
    API_HOST: appConfig.REACT_APP_API_HOST || process.env.REACT_APP_API_HOST as string,
    BASE_PATH: appConfig.REACT_APP_BASE_PATH || process.env.REACT_APP_BASE_PATH || '',
}
