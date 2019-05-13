import { capitalize as _capitalize } from './utils'

let filters: { [key: string]: Function } = {
    capitalize(value: string | null): string | null {
        if (!value) {
            return null
        }

        return _capitalize(value)
    }
}

export default filters
