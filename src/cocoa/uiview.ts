import "reflect-metadata";

interface IRawParams {
    [key: string]: any
}

export interface Node {
    view: UIView
    subviews: Node[]
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

function attribute(type: any, label: string) {
    return (target: Object, propertyKey: string | symbol): void => {
        Reflect.defineMetadata('isAttribute', true, target, propertyKey)
        Reflect.defineMetadata('label', label, target, propertyKey)
        Reflect.defineMetadata('design:type', type, target, propertyKey)
    }
}

export class UIView implements IRawParams {
    [key: string]: any

    name: string = "view"
    className: string = "UIView"

    @attribute(UIColor, "背景色")
    backgroundColor: UIColor | null = null

    get attributes(): UIViewAttribute[] {
        console.log(Object.keys(this))

        return Object.keys(this).filter(k => Reflect.getMetadata('isAttribute', this, k)).map(k => {
            return {
                key: k,
                value: this[k],
                label: Reflect.getMetadata("label", this, k),
                type: Reflect.getMetadata("design:type", this, k)
            }
        })
    }
}

export class UILabel extends UIView {
    name: string = "label"
    className: string = "UILabel"

    @attribute(String, "文本")
    text: string | null = null

    @attribute(UIColor, "文本颜色")
    textColor: UIColor | null = null

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    constructor() {
        super()
    }
}

export class UIButton extends UIView {
    name: string = "button"
    className: string = "UIButton"

    @attribute(String, "文本")
    title: string | null = null

    @attribute(UIColor, "文本颜色")
    titleColor: UIColor | null = null

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    constructor() {
        super()
    }
}
