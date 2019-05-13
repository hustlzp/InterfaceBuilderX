
export interface IRawParams {
    [key: string]: any
}

export function capitalize(s: string): string {
    if (typeof s !== 'string') return ''

    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function indent(string: string, level = 1): string {
    let options = {
        indent: ' ',
        includeEmptyLines: false,
    };

    if (typeof string !== 'string') {
        throw new TypeError(
            `Expected \`input\` to be a \`string\`, got \`${typeof string}\``
        );
    }

    if (typeof level !== 'number') {
        throw new TypeError(
            `Expected \`count\` to be a \`number\`, got \`${typeof level}\``
        );
    }

    if (level < 0) {
        throw new RangeError(
            `Expected \`count\` to be at least 0, got \`${level}\``
        );
    }

    if (typeof options.indent !== 'string') {
        throw new TypeError(
            `Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``
        );
    }

    if (level === 0) {
        return string;
    }

    const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

    return string.replace(regex, options.indent.repeat(level * 4));
}
