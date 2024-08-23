const diffAt = (valueA: string, valueB: string, max?: number) => {
    let i = 0
    for(const charA of valueA) {
        const charB = valueB.charAt(i)
        if(charB !== charA) {
            break
        }
        if(typeof max === 'number' && (i + 1) > max) {
            break
        }
        i++
    }
    return i
}

export const diffText = (valueA: string, valueB: string) => {
    const startChange = diffAt(valueA, valueB)
    const to = diffAt(
        valueA.slice(startChange).split('').reverse().join(''),
        valueB.slice(startChange).split('').reverse().join(''),
    )
    const endChangeA = valueA.length - to
    const endChangeB = valueB.length - to
    const startString = valueA.slice(0, startChange)
    const changedStringA = valueA.slice(startChange, endChangeA)
    const changedStringB = valueB.slice(startChange, endChangeB)
    const endString = valueA.slice(endChangeA)
    return {
        startChange: startChange,
        endChangeA: endChangeA,
        endChangeB: endChangeB,
        startString: startString,
        changedStringA: changedStringA,
        changedStringB: changedStringB,
        endString: endString,
    }
}

export const splitDiffText = (valueA: string, valueB: string, parts?: number) => {
    if(valueA === '') {
        return {
            startChange: 0,
            endChangeA: 0,
            endChangeB: valueB.length,
            startString: '',
            changedStringA: '',
            changedStringB: valueB,
            endString: '',
        }
    }
    parts = typeof parts === 'undefined' ?
        valueA.length > 100000 ? 50 :
            valueA.length > 10000 ? 16 :
                valueA.length > 1000 ? 8 : valueA.length > 200 ? 4 : 2 :
        parts
    const segment = Number((valueA.length / parts).toFixed(0))
    let j = 0
    do {
        const offset = j * segment
        const partA = valueA.slice(offset, offset + segment)
        const partB = valueB.slice(offset, offset + segment)
        // const partA = valueA.slice(0, segment)
        // const partB = valueB.slice(0, segment)
        // console.log('sdiftx', j, parts, (partA !== partB), offset, segment, j * segment)
        if(partA !== partB) {
            const diffR = diffText(valueA.slice(offset), valueB.slice(offset))
            return {
                startChange: diffR.startChange + offset,
                endChangeA: diffR.endChangeA + offset,
                endChangeB: diffR.endChangeB + offset,
                startString: valueA.slice(0, offset) + diffR.startString,
                changedStringA: diffR.changedStringA,
                changedStringB: diffR.changedStringB,
                endString: diffR.endString,
            }
        }
        j++
        // offset = j * segment
        // partA = valueA.slice(j * segment)
        // partB = valueB.slice(j * segment)
    } while(j <= parts)
    return undefined
}

/*console.log(
    'splitDiffText',
    diffText('in which some change occurs with a change in temperature; and some means of converting this change into a numerical (2) value (e.g. the visible scale that is marked on a mercury-in-glass thermometer or the digital readout on an infrared model). Thermometers are widely used in technology and industry to monitor processes, in meteorology, in medicine, and in scientific research.', 'in which some change occurs with a change in temperature; and some means of converting this change into a numerical value (e.g. the visible scale that is marked on a mercury-in-glass thermometer or the digital readout on an infrared model). Thermometers are widely used in technology and industry to monitor processes, in meteorology, in medicine, and in scientific research.'),
    splitDiffText('in which some change occurs with a change in temperature; and some means of converting this change into a numerical (2) value (e.g. the visible scale that is marked on a mercury-in-glass thermometer or the digital readout on an infrared model). Thermometers are widely used in technology and industry to monitor processes, in meteorology, in medicine, and in scientific research.', 'in which some change occurs with a change in temperature; and some means of converting this change into a numerical value (e.g. the visible scale that is marked on a mercury-in-glass thermometer or the digital readout on an infrared model). Thermometers are widely used in technology and industry to monitor processes, in meteorology, in medicine, and in scientific research.'),
)*/
/*const cases = [
    // same text
    ['abcde', 'abcde', ''],
    // pure insertions:
    ['abcdef', 'ab2cdef', '2'],
    ['ab2cdef', 'ab234cdef', '34'],
    ['abcdef', 'abcdefghijk', 'ghijk'],
    ['abcd', 'abcdd', 'd', 'abcd', ''],// same char again
    ['abcdef', 'abcddef', 'd', 'abcd', 'ef'],// same char again
    // pure deletions:
    ['ab23cdef', 'ab2cdef', ''],
    ['ab23cdef', 'abcdef', ''],
    ['abcdefghijk', 'abcdef', ''],
    ['abcdefghijk', 'ghijk', ''],
    ['abbbc', 'abbc', '', 'abb', 'c'],
    ['abbbbbc', 'abbc', '', 'abb', 'c'],
    ['abbbbbbbbc', 'abbc', '', 'abb', 'c'],
    // pure replacements:
    ['abbbc', 'abcbc', 'c', 'ab', 'bc'],
    ['abbbbbc', 'abcccbc', 'ccc', 'ab', 'bc'],
    // pure replacements:
    ['abcdef', 'ab2def', '2'],
    ['ab23cdef', 'ab456def', '456'],
    ['abc', 'ab2', '2'],
    ['abc', '2bc', '2'],
    // delete & change:
    ['ab23cdef', 'ab1ef', '1'],// same start
    ['ab23cdef', 'a1def', '1'],// other start
    ['ab23cdef', 'ab23c1', '1'],// on end
    ['ab23cdef', '13cdef', '1'],// on start
    // insert & change:
    ['ab23cdef', 'ab24cdef', '4'],// single
    ['ab23cdef', 'ab2456789cdef', '456789'],// multiple, same start
    ['ab23cdef', 'a456789cdef', '456789'],// multiple, other start
    ['ab23cdef', 'ab456789', '456789'],// multiple, on end
    ['ab23cdef', '456789cdef', '456789'],// multiple, on start
] as ([string, string, string] | [string, string, string, string, string] | [string, string])[]

// cases.forEach(([textA, textB], i) => diffText(textA, textB))
// cases.forEach(([textA, textB], i) => console.log(i, textA, textB, diffText(textA, textB)))
cases.forEach(([textA, textB, changedB, startString, endString], i) => {
    const r = diffText(textA, textB)
    console.log(
        i.toString().padStart(2, '0'),
        textA, textB, textA.length, textB.length,
        r.startChange, r.endChangeA, r.endChangeB,
        JSON.stringify(r.changedStringA), JSON.stringify(r.changedStringB),
        JSON.stringify(r.startString), JSON.stringify(r.endString),
    )
    const nextSub2 = r.startString + r.changedStringB + r.endString
    const nextSub = textA.slice(0, r.startChange) + r.changedStringB + textA.slice(r.endChangeA)
    // const nextSub = r.endChangeB === r.endChangeA && r.startChange === textA.length ? textA : textA.slice(0, r.startChange) + r.changedStringB + textA.slice(r.endChangeA)
    console.log(
        i.toString().padStart(2, '0'),
        nextSub === textB, nextSub2 === textB, nextSub, textB,
        changedB === r.changedStringB,
        typeof startString === 'string' ? startString === r.startString : null,
        typeof startString === 'string' ? endString === r.endString : null,
    )
    console.log(' ')
})*/
