import React from 'react'
import { UseProgressControlActions } from 'react-progress-state'

export const useProgressRun = (actions: Pick<UseProgressControlActions, 'setStart' | 'setDone' | 'setError' | 'isDone'>) => {
    const {
        setStart,
        setDone, setError,
        isDone,
    } = actions
    return React.useCallback(function progressRun<R>(key: string, loader: () => Promise<R>, forceReload?: boolean) {
        return new Promise<R | undefined>((resolve, reject) => {
            if(!forceReload && isDone(key)) {
                return resolve(undefined)
            }
            const pid = setStart(key)
            loader()
                .then((r) => {
                    const isPid = setDone(key, undefined, pid)
                    if(!isPid) {
                        return undefined
                    }
                    return r
                })
                .then((r) => {
                    resolve(r)
                })
                .catch((e) => {
                    setError(key, e, pid)
                    reject(e)
                })
        })
    }, [setStart, setDone, setError, isDone])
}
