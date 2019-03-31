import "reflect-metadata";

export interface Node {
    view: UIView
    subviews: Node[]
}

export class UIColor {
    r!: number
    g!: number
    b!: number
    a!: number
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
    type: any
}

interface IRawParams {
    [key: string]: any
}

function attribute(type: any) {
    return (target: Object, propertyKey: string | symbol): void => {
        Reflect.defineMetadata('isAttribute', true, target, propertyKey)
        Reflect.defineMetadata('design:type', type, target, propertyKey)
    }
}

export class UIView implements IRawParams {
    [key: string]: any

    name: string = "view"
    className: string = "UIView"

    // @Reflect.metadata('isAttribute', true)
    @attribute(UIColor)
    backgroundColor: UIColor | null = null

    get attributes(): UIViewAttribute[] {
        console.log(Object.keys(this))

        return Object.keys(this).filter(k => Reflect.getMetadata('isAttribute', this, k)).map(k => {
            return {
                key: k,
                value: this[k],
                type: Reflect.getMetadata("design:type", this, k)
            }
        })
    }
}

export class UILabel extends UIView {
    name: string = "label"
    className: string = "UILabel"

    @attribute(String)
    text: string | null = null

    @attribute(UIColor)
    textColor: UIColor | null = null

    @attribute(UIFont)
    font: UIFont = UIFont.system(17)

    constructor() {
        super()
    }
}

export class UIButton extends UIView {
    name: string = "button"
    className: string = "UIButton"

    @attribute(String)
    title: string | null = null

    @attribute(UIColor)
    titleColor: UIColor | null = null

    @attribute(UIFont)
    font: UIFont = UIFont.system(17)

    constructor() {
        super()
    }
}
