import "reflect-metadata";
import uuidv4 from 'uuid/v4';
import { capitalize, indent, IRawParams } from '@/utils';
import { AutoLayoutConstraint, AutoLayoutRelation } from '@/cocoa/AutoLayout'
import { UIStackView } from './UIStackView';

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

    get codes(): string {
        return `UIColor(hex: 0x${this.hex.replace('#', '')})`
    }
}

export enum UIFontWeight {
    ultraLight = "ultraLight",
    light = "light",
    regular = "regular",
    medium = "medium",
    semibold = "semibold",
    bold = "bold",
    heavy = "heavy",
    black = "black"
}

export class UIFont {
    name?: string
    isSystem: boolean = true
    size: number = 17
    weight: UIFontWeight = UIFontWeight.regular

    static system(size: number): UIFont {
        let font = new UIFont()

        font.isSystem = true
        font.size = size
        font.weight = UIFontWeight.regular

        return font
    }

    get codes(): string {
        if (this.weight == UIFontWeight.regular) {
            return `UIFont.systemFont(ofSize: ${this.size})`
        } else {
            return `UIFont.systemFont(ofSize: ${this.size}, weight: .${this.weight})`
        }
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
    superview: UIView | null = null
    constraints: AutoLayoutConstraint[] = []

    // 是否使用函数形式
    // 仅 rootView 适用
    asFunction: boolean = false

    // 是否为组件
    isComponent: boolean = false
    // 组件名称
    componentName: string | null = null
    // 组件实例列表
    componentInstances: UIView[] = []

    // 是否为组件实例
    isComponentInstance: boolean = false
    // 所属的组件
    component: UIView | null = null

    constructor(subviews: UIView[] = []) {
        this.subviews = subviews

        subviews.forEach(subview => {
            subview.superview = this
        })
    }

    @attribute(UIColor, "背景色")
    backgroundColor: UIColor | null = null

    @attribute(Number, "Corner Radius")
    cornerRadius: number = 0

    get isRoot(): boolean {
        return this.superview == null
    }

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

    addConstraint(constraint: AutoLayoutConstraint) {
        this.constraints.push(constraint)
    }

    removeConstraint(constraint: AutoLayoutConstraint) {
        this.constraints = this.constraints.filter(c => c.id != constraint.id)
    }

    updateConstraint(constraint: AutoLayoutConstraint) {
        console.log(constraint)
        this.constraints = this.constraints.map(c => c.id == constraint.id ? constraint : c)
    }

    addSubview(subview: UIView): void {
        this.subviews.push(subview)
        subview.superview = this
    }

    allSubviews(): UIView[] {
        let subviews: UIView[] = []

        this.subviewIterator((view) => {
            subviews.push(view)
        })

        return subviews
    }

    subviewIterator(callback: (view: UIView) => void): void {
        for (const subview of this.subviews) {
            callback(subview)

            if (subview.subviews.length > 0) {
                subview.subviewIterator(callback)
            }
        }
    }

    codes(): string {
        var codes = this.asFunction ? "" : this.viewCodes(null)

        if (this.subviews.length > 0 && !this.asFunction) {
            codes += "\n\n// 约束"
            codes += "\n\n"
            codes += this.layoutCodes(null)
        }

        codes += "\n\n"
        codes += this.componentCodes()

        // 移除首尾换行
        // 保证最多 2 个换行
        codes = codes.trim().replace(/\n{3,}/g, '\n\n');

        return codes
    }

    // View 代码
    viewCodes(superview: UIView | null): string {
        let codes =
            this.asFunction ?
                `let ${this.name} = create${capitalize(this.name!)}()` :
                this.isComponent ?
                    `let ${this.name} = create${capitalize(this.componentName!)}()` :
                    this.isComponentInstance ?
                        `let ${this.name} = create${capitalize(this.component!.componentName!)}()` :
                        this.selfViewCodes()

        if (superview && superview.className != "UIStackView") {
            codes += `\n${superview.name}.addSubview(${this.name})`
        }

        if (!this.isComponent && !this.asFunction && !this.isComponentInstance) {
            codes += this.subviewsViewCodes()
        }

        return codes
    }

    // Layout 代码
    private layoutCodes(superview: UIView | null): string {
        var codes = this.selfLayoutCodes()

        if (!this.isComponent && !this.asFunction && !this.isComponentInstance) {
            codes += this.subviewsLayoutCodes()
        }

        return codes
    }

    // 组件函数代码
    private componentCodes(): string {
        let codes = this.selfComponentCodes()

        codes += this.subviewsComponentCodes()

        return codes
    }

    // 自身 View 代码
    selfViewCodes(): string {
        let codes = `let ${this.name} = UIView()`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        return codes
    }

    // 公共属性代码
    publicSelfViewAttributesCodes(): string {
        var codes = ""

        if (this.backgroundColor) {
            codes += `\n${this.name}.backgroundColor = ${this.backgroundColor.codes}`
        }

        if (this.cornerRadius > 0) {
            codes += `\n${this.name}.layer.cornerRadius = ${this.cornerRadius}`
            codes += `\n${this.name}.layer.maskToBounds = true`
        }

        return codes
    }

    private selfLayoutCodes(): string {
        let codes = ""

        // 自身约束代码
        if (this.constraints.length > 0) {
            codes += `${this.name}.snp.makeConstraints { (make) in`

            for (const constraint of this.constraints) {
                codes += `\n    make.${this.constraintCodes(constraint)}`
            }

            codes += "\n}"
        }

        return codes
    }

    private selfComponentCodes(): string {
        var codes = ""

        if (this.isComponent || this.asFunction) {
            let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
            codes += `private func create${componentName}() -> ${this.className} {`

            codes += "\n"
            codes += indent(this.selfViewCodes())

            codes += "\n\n"
            codes += indent(this.subviewsViewCodes())

            if (this.subviews.length > 0) {
                codes += "\n\n    // 约束"

                if (this.asFunction) {
                    codes += "\n\n"
                    codes += indent(this.selfLayoutCodes())
                }

                codes += indent(this.subviewsLayoutCodes())
            }

            codes += indent(`\n\nreturn ${this.name}`)
            codes += "\n}"
        }

        return codes
    }

    subviewsViewCodes(): string {
        let codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.viewCodes(this)
        }

        return codes
    }

    private subviewsLayoutCodes(): string {
        var codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.layoutCodes(this)
        }

        return codes
    }

    private subviewsComponentCodes(): string {
        var codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.componentCodes()
        }

        return codes
    }

    private constraintCodes(constraint: AutoLayoutConstraint): string {
        var codes = `${constraint.attribute}`

        var relationName = ""
        switch (constraint.relation) {
            case AutoLayoutRelation.equal:
                relationName = "equalTo"
                break
            case AutoLayoutRelation.lessThanOrEqual:
                relationName = "lessThanOrEqualTo"
                break
            case AutoLayoutRelation.greaterThanOrEqual:
                relationName = "greaterThanOrEqualTo"
                break
        }
        codes += `.${relationName}`

        if (constraint.toView) {
            let toViewName = constraint.toView == this ? "self" : constraint.toView.name
            codes += `(${toViewName}`

            if (constraint.toAttribute) {
                codes += `.snp.${constraint.toAttribute})`
            } else {
                codes += ")"
            }

            if (constraint.constant) {
                codes += `.offset(${constraint.constant})`
            } else if (constraint.multiplier) {
                codes += `.multipliedBy(${constraint.multiplier})`
            }
        } else if (constraint.constant) {
            codes += `(${constraint.constant})`
        }

        return codes
    }

    private constraintCodesForDisplay(constraint: AutoLayoutConstraint): string {
        var codes = `${constraint.attribute}`

        var relationName = ""
        switch (constraint.relation) {
            case AutoLayoutRelation.equal:
                relationName = "="
                break
            case AutoLayoutRelation.lessThanOrEqual:
                relationName = "<="
                break
            case AutoLayoutRelation.greaterThanOrEqual:
                relationName = ">="
                break
        }
        codes += ` ${relationName}`

        if (constraint.toView) {
            let toViewName = constraint.toView == this ? "self" : constraint.toView.name
            codes += ` ${toViewName}`

            if (constraint.toAttribute) {
                codes += `.${constraint.toAttribute}`
            } else {
                codes += `.${constraint.attribute}`
            }

            if (constraint.constant) {
                if (constraint.constant >= 0) {
                    codes += ` + ${constraint.constant}`
                } else {
                    codes += ` - ${Math.abs(constraint.constant)}`
                }
            } else if (constraint.multiplier) {
                codes += ` * ${constraint.multiplier}`
            }
        } else if (constraint.constant) {
            codes += ` ${constraint.constant}`
        }

        return codes
    }
}
