import "reflect-metadata";
import uuidv4 from 'uuid/v4';

interface IRawParams {
    [key: string]: any
}

export class Node {
    id: string = uuidv4()
    view!: UIView
    subnodes: Node[] = []

    constructor(view: UIView, subnodes: Node[] = []) {
        this.view = view
        this.subnodes = subnodes
    }

    codes(): string {
        let codes = this.viewCodes(null)

        codes += "\n\n// 约束\n\n"
        codes += this.layoutCodes(null)

        return codes
    }

    viewCodes(supernode: Node | null): string {
        let codes = this.view.codes(supernode ? supernode.view : null)

        for (const subnode of this.subnodes) {
            codes += "\n\n"
            codes += subnode.viewCodes(this)
        }

        return codes
    }

    layoutCodes(supernode: Node | null): string {
        let codes = this.view.layoutCodes(supernode ? supernode.view : null)

        for (const subnode of this.subnodes) {
            codes += "\n\n"
            codes += subnode.layoutCodes(this)
        }

        return codes
    }
}

export class UIColor {
    r!: number
    g!: number
    b!: number
    a!: number

    constructor(r: number, g: number, b: number, a: number = 1) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    static black: UIColor = new UIColor(0, 0, 0, 1)
    static white: UIColor = new UIColor(255, 255, 255, 1)

    static fromHex(hex: string): UIColor | null {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? new UIColor(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1) : null;
    }

    get hex(): string {
        return "#" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b);
    }

    componentToHex(c: number): string {
        var hex = c.toString(16);

        return hex.length == 1 ? "0" + hex : hex;
    }

    codes(): string {
        return `UIColor(hex: 0x${this.hex.replace('#', '')})`
    }
}

export class UIFont {
    name?: string
    isSystem: boolean = true
    size: number = 17

    static system(size: number): UIFont {
        let font = new UIFont()

        font.isSystem = true
        font.size = size

        return font
    }
}

export interface UIViewAttribute {
    key: string
    value: any
    label: string
    type: any
}

export function attribute(type: any, label: string) {
    return (target: Object, propertyKey: string | symbol): void => {
        Reflect.defineMetadata('isAttribute', true, target, propertyKey)
        Reflect.defineMetadata('label', label, target, propertyKey)
        Reflect.defineMetadata('design:type', type, target, propertyKey)
    }
}

export class UIView implements IRawParams {
    [key: string]: any

    id: string = uuidv4()
    name: string = "view"
    className: string = "UIView"

    @attribute(UIColor, "背景色")
    backgroundColor: UIColor | null = null

    get attributes(): UIViewAttribute[] {
        // console.log(Object.keys(this))

        return Object.keys(this).filter(k => Reflect.getMetadata('isAttribute', this, k)).map(k => {
            return {
                key: k,
                value: this[k],
                label: Reflect.getMetadata("label", this, k),
                type: Reflect.getMetadata("design:type", this, k)
            }
        })
    }

    codes(superview: UIView | null): string {
        let codes = `let ${this.name} = UIView()`

        if (superview) {
            codes += `\n${superview.name}.addSubview(${name})`
        }

        return codes
    }

    layoutCodes(superview: UIView | null): string {
        var codes = `${this.name}.snp.makeConstraints { (make) in`

        if (superview) {
            codes += `\n    make.edges.equalTo(${superview.name})`
        }

        codes += "\n}"

        return codes
    }
}
