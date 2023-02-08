export const urlParams = (initial: [string, string | number][] = []) => {
    const params: [string, string | number][] = [...initial]
    return {
        push: (key: string, val: string | number | (string | number)[]) =>
            Array.isArray(val) ?
                val.map(v => params.push([key + '[]', v])) :
                params.push([key, val]),
        toString: () =>
            params.length === 0 ? '' :
                '?' + params.map(([key, val]) => key + '=' + encodeURIComponent(val)).join('&'),
    }
}
