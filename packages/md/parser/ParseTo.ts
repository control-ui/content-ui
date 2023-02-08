import { Processor, unified } from 'unified'
import { VFile } from 'vfile'

// todo: use instead (gfm plugins) `import { combineExtensions } from 'micromark-util-combine-extensions';`
export const parser = (): Processor<any, any, any, string> => unified() as Processor<any, any, any, string>

export function parseTo(
    textValue: string,
    processor: Processor<any, any, any, string>,
): Promise<{
    root: any
    file: VFile
    toString: () => string
}> {
    const file = new VFile(textValue)
    const ast = processor.parse(file)

    return processor
        .run(ast, file)
        .then((root) => {
            return {
                root: root,
                file: file,
                toString: () => processor.stringify(root, file) as string,
            }
        })
}
