export const copyToClipBoard = async(text: string) => {
    if(!navigator.clipboard) {
        return false
    }
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch(err) {
        console.error('Failed to copy!', err)
    }
    return false
}
