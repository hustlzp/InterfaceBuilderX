
export function capitalize(s: string): string {
    if (typeof s !== 'string') return ''

    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function indent(string: string, count = 1): string {
    let options = {
        indent: ' ',
        includeEmptyLines: false,
    };

    if (typeof string !== 'string') {
        throw new TypeError(
            `Expected \`input\` to be a \`string\`, got \`${typeof string}\``
        );
    }

    if (typeof count !== 'number') {
        throw new TypeError(
            `Expected \`count\` to be a \`number\`, got \`${typeof count}\``
        );
    }

    if (count < 0) {
        throw new RangeError(
            `Expected \`count\` to be at least 0, got \`${count}\``
        );
    }

    if (typeof options.indent !== 'string') {
        throw new TypeError(
            `Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``
        );
    }

    if (count === 0) {
        return string;
    }

    const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

    return string.replace(regex, options.indent.repeat(count));
}
