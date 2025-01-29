import { useRef } from 'react'

const isObjectChanged = (
    lastObject: object,
    currentObject: object,
) => {
    // modified or new properties
    for(const key in currentObject) {
        if(currentObject[key] !== lastObject[key]) return true
    }

    // if lastObject has keys that are missing in currentObject
    for(const key in lastObject) {
        if(!Object.prototype.hasOwnProperty.call(currentObject, key)) return true
    }

    return false
}

/**
 * Memo on a single object, returned object will only change if any of the properties are not equal (===).
 *
 *  Does not compare order of properties.
 */
export function useMemoObject<O extends object>(currentObject: O) {
    const obj = useRef(currentObject)

    if(isObjectChanged(obj.current, currentObject)) {
        obj.current = currentObject
    }

    return obj.current
}
