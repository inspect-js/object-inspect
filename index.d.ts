interface opts {
    quoteStyle?: 'single' | 'double'
    maxStringLength?: number | null
    customInspect?: true | 'symbol'
    indent?: '\t' | null | number
    numericSeparator?: boolean
}

export default function (value: unknown, options?: opts): string