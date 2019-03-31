export interface Node {
    view: UIView
    subviews: Node[]
}

// let a = Reflect.metadata("1", 2)
// let b = a()

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


function sealed(a: any, b: any) {
    // do something with 'target' ...
    console.log(a)
    console.log(b)
}

export class UIView {
    name: string = "view"
    className: string = "UIView"

    backgroundColor?: UIColor

}

export class UILabel extends UIView {
    text?: string
    textColor?: UIColor
    font: UIFont = UIFont.system(17)

    constructor() {
        super()

        this.name = "label"
        this.className = "UILabel"
    }
}

export class UIButton extends UIView {
    title?: string
    titleColor?: UIColor
    font: UIFont = UIFont.system(17)

    constructor() {
        super()

        this.name = "button"
        this.className = "UIButton"
    }
}
