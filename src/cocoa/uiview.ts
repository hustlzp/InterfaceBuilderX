import "reflect-metadata";
import uuidv4 from 'uuid/v4';
import { capitalize, indent } from '@/utils';

interface IRawParams {
    [key: string]: any
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
    subviews: UIView[] = []
    isComponent: boolean = false

    constructor(subviews: UIView[] = []) {
        this.subviews = subviews
    }

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

    codes(): string {
        var codes = this.viewCodes(null)

        if (this.subviews.length > 0) {
            codes += "\n\n// 约束"
            codes += this.layoutCodes(null)
        }

        codes += "\n\n"
        codes += this.componentCodes()

        // 移除首尾换行
        // 保证最多 2 个换行
        codes = codes.trim().replace(/\n{3,}/g, '\n\n');

        return codes
    }

    // 自身 View 代码
    selfViewCodes(): string {
        return `let ${this.name} = UIView()`
    }

    // View 代码
    private viewCodes(superview: UIView | null): string {
        let codes = this.isComponent ?
            `let ${this.name} = create${capitalize(this.name)}()` :
            this.selfViewCodes()

        if (superview) {
            codes += `\n${superview.name}.addSubview(${this.name})`
        }

        if (!this.isComponent) {
            for (const subview of this.subviews) {
                codes += "\n\n"
                codes += subview.viewCodes(this)
            }
        }

        return codes
    }

    // Layout 代码
    private layoutCodes(superview: UIView | null): string {
        var codes = ""

        if (superview) {
            codes += `${this.name}.snp.makeConstraints { (make) in`
            codes += `\n    make.edges.equalTo(${superview.name})`
            codes += "\n}"
        }

        if (!this.isComponent) {
            for (const subview of this.subviews) {
                codes += "\n\n"
                codes += subview.layoutCodes(this)
            }
        }

        return codes
    }

    // 组件函数代码
    private componentCodes(): string {
        var codes = ""

        if (this.isComponent) {
            codes += `private func create${capitalize(this.name)}() -> ${this.className} {`

            codes += "\n"
            codes += indent(this.viewCodesInComponent(), 4)

            if (this.subviews.length > 0) {
                codes += "\n\n    // 约束"
                codes += indent(this.layoutCodesInComponent(), 4)
            }

            codes += indent(`\n\nreturn ${this.name}`, 4)
            codes += "\n}"
        }

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.componentCodes()
        }

        return codes
    }

    private viewCodesInComponent(): string {
        let codes = this.selfViewCodes()

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.viewCodes(this)
        }

        return codes
    }

    private layoutCodesInComponent(): string {
        var codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.layoutCodes(this)
        }

        return codes
    }
}
