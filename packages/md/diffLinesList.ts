import { List } from 'immutable'

export const diffLinesList = (
    linesA: List<string>,
    linesB: List<string>,
) => {
    const linesACount = linesA.size
    const linesBCount = linesB.size
    const diffs: any[] = []
    const diffLine = (lineA: string | undefined, lineB: string | undefined, i: number) => {
        if(typeof lineB === 'undefined') {
            return {
                line: i,
                type: 'deleted',
            }
        } else if(typeof lineA === 'undefined') {
            return {
                line: i,
                type: 'added',
                text: lineB,
            }
        } else if(lineA !== lineB) {
            return {
                line: i,
                type: 'changed',
                text: lineB,
            }
        }
        return undefined
    }
    if(linesACount >= linesBCount) {
        linesA.forEach((lineA, i) => {
            const lineB = linesB.get(i)
            const diff = diffLine(lineA, lineB, i)
            if(diff) {
                diffs.push(diff)
            }
        })
    } else if(linesACount < linesBCount) {
        linesB.forEach((lineB, i) => {
            const lineA = linesA.get(i)
            const diff = diffLine(lineA, lineB, i)
            if(diff) {
                diffs.push(diff)
            }
        })
    }
    return diffs
}
