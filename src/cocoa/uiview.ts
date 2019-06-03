import "reflect-metadata";
import uuidv4 from 'uuid/v4';
import { capitalize, indent, IRawParams } from '@/utils';
import { AutoLayoutConstraint, AutoLayoutRelation } from '@/cocoa/AutoLayout'

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
    type: any,
    enums?: { key: string, value: any }[] | null
}

class Enum {
}

export function attribute(type: any, label: string) {
    return (target: Object, propertyKey: string | symbol): void => {
        Reflect.defineMetadata('isAttribute', true, target, propertyKey)
        Reflect.defineMetadata('label', label, target, propertyKey)
        Reflect.defineMetadata('type', type, target, propertyKey)
    }
}

export function enumAttribute(type: any, label: string) {
    let enumKeys = Object.keys(type).filter(key => isNaN(parseInt(key, 10)))
    let enums = enumKeys.map(key => {
        return { key: key, value: type[key] }
    })

    return (target: Object, propertyKey: string | symbol): void => {
        Reflect.defineMetadata('isAttribute', true, target, propertyKey)
        Reflect.defineMetadata('label', label, target, propertyKey)
        Reflect.defineMetadata('type', Enum, target, propertyKey)
        Reflect.defineMetadata('enums', enums, target, propertyKey)
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

    // 是否为组件
    isComponent: boolean = false
    isFunctionComponent: boolean = false    // 函数组件
    isClassComponent: boolean = false   // 类组件
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
                type: Reflect.getMetadata("type", this, k),
                enums: Reflect.getMetadata("enums", this, k)
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

    constraintIterator(callback: (constraint: AutoLayoutConstraint) => void): void {
        this.constraints.forEach(constraint => callback(constraint))

        for (const subview of this.subviews) {
            subview.constraintIterator(callback)
        }
    }

    codes(): string {
        var codes = this.isComponent ? "" : this.viewCodes(null)

        if (this.subviews.length > 0 && !this.isComponent) {
            codes += "\n\n// 约束"
            codes += "\n\n"
            codes += this.layoutCodes(null)
        }

        if (!this.isClassComponent) {
            codes += "\n\n"
            codes += this.functionComponentCodes()
        }

        codes += "\n\n"
        codes += this.classComponentCodes()

        // 移除首尾换行
        // 保证最多 2 个换行
        codes = codes.trim().replace(/\n{3,}/g, '\n\n');

        return codes
    }

    /**
     * Self + Subviews
     */

    // View 代码
    viewCodes(superview: UIView | null): string {
        var codes = ""

        if (this.isComponent || this.isComponentInstance) {
            let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)

            if (this.isClassComponent || (this.component && this.component.isClassComponent)) {
                codes += `let ${this.name} = ${componentName}()`
            } else {
                codes += `let ${this.name} = create${componentName}()`
            }
        } else {
            codes += this.selfViewCodes()
        }

        if (superview) {
            let prefix = superview.isClassComponent ? "" : `${superview.name}.`

            if (superview.className == "UIStackView") {
                codes += `\n${prefix}addArrangedSubview(${this.name})`
            } else {
                codes += `\n${prefix}addSubview(${this.name})`
            }
        }

        if (!this.isComponent && !this.isComponentInstance) {
            codes += this.subviewsViewCodes()
        }

        return codes
    }

    // Layout 代码
    private layoutCodes(superview: UIView | null): string {
        var codes = this.selfLayoutCodes()

        if (!this.isComponent && !this.isComponentInstance) {
            codes += this.subviewsLayoutCodes()
        }

        return codes
    }

    // 函数组件代码
    private functionComponentCodes(): string {
        let codes = this.selfFunctionComponentCodes()

        codes += this.subviewsFunctionComponentCodes()

        return codes
    }

    // 函数组件代码
    private classComponentCodes(): string {
        let codes = this.selfClassComponentCodes()

        codes += this.subviewsClassComponentCodes()

        return codes
    }

    /**
     * Self
     */

    // 自身 View 代码
    selfViewCodes(): string {
        let codes = this.isClassComponent ? "" : `let ${this.name} = ${this.className}()`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        return codes
    }

    // 公共属性代码
    publicSelfViewAttributesCodes(): string {
        var codes = ""
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        if (this.backgroundColor) {
            codes += `\n${prefix}backgroundColor = ${this.backgroundColor.codes}`
        }

        if (this.cornerRadius > 0) {
            codes += `\n${prefix}layer.cornerRadius = ${this.cornerRadius}`
            codes += `\n${prefix}layer.masksToBounds = true`
        }

        return codes
    }

    // 自身 Layout 代码
    selfLayoutCodes(): string {
        let codes = ""
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        // 自身约束代码
        if (this.constraints.length > 0) {
            codes += `${prefix}snp.makeConstraints { (make) in`

            for (const constraint of this.constraints) {
                codes += `\n    make.${this.constraintCodes(constraint)}`
            }

            codes += "\n}"
        }

        return codes
    }

    // 自身函数组件代码
    selfFunctionComponentCodes(): string {
        if (!this.isFunctionComponent) {
            return ""
        }

        let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
        let codes = `private func create${componentName}() -> ${this.className} {`

        // View Creation Codes
        let viewCreationCodes = this.selfViewCodes()
        viewCreationCodes += "\n\n"
        viewCreationCodes += this.subviewsViewCodes()
        if (this.subviews.length > 0
            || (this.isComponent && this.constraints.length > 0)) {
            viewCreationCodes += "\n\n// 约束"

            if (this.isComponent) {
                viewCreationCodes += "\n\n"
                viewCreationCodes += this.selfLayoutCodes()
            }

            viewCreationCodes += this.subviewsLayoutCodes()
        }

        codes += "\n"
        codes += indent(viewCreationCodes)
        codes += indent(`\n\nreturn ${this.name}`)
        codes += "\n}"

        return codes
    }

    // 自身类组件代码
    selfClassComponentCodes(): string {
        if (!this.isClassComponent) {
            return ""
        }

        let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
        let codes = `class ${componentName}: ${this.className} {`

        // View Creation Codes
        let viewCreationCodes = this.selfViewCodes()
        viewCreationCodes += "\n\n"
        viewCreationCodes += this.subviewsViewCodes()
        if (this.subviews.length > 0
            || (this.isComponent && this.constraints.length > 0)) {
            viewCreationCodes += "\n\n// 约束"

            if (this.isComponent) {
                viewCreationCodes += "\n\n"
                viewCreationCodes += this.selfLayoutCodes()
            }

            viewCreationCodes += this.subviewsLayoutCodes()
        }

        codes += "\n\n"
        codes += indent(this.classInitCodes())
        codes += "\n\n"
        codes += indent(viewCreationCodes, 2)
        codes += indent("\n}")
        codes += "\n\n"
        codes += indent("required init?(coder aDecoder: NSCoder) {")
        codes += indent(`\nfatalError("init(coder:) has not been implemented")`, 2)
        codes += indent("\n}")
        codes += indent(this.subviewsFunctionComponentCodes())
        codes += "\n}"

        return codes
    }

    // 类初始化函数
    classInitCodes(): string {
        let codes = "override init(frame: CGRect) {"
        codes += indent("\nsuper.init(frame: frame)")

        return codes
    }

    /**
     * Subviews
     */

    subviewsViewCodes(): string {
        let codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.viewCodes(this)
        }

        return codes
    }

    subviewsLayoutCodes(): string {
        var codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.layoutCodes(this)
        }

        return codes
    }

    private subviewsFunctionComponentCodes(): string {
        var codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.functionComponentCodes()
        }

        return codes
    }

    private subviewsClassComponentCodes(): string {
        var codes = ""

        for (const subview of this.subviews) {
            codes += "\n\n"
            codes += subview.classComponentCodes()
        }

        return codes
    }

    /**
     * Constraint
     */

    get isLackOfConstraints(): boolean {
        return this.superview != null && this.superview.className != "UIStackView" && this.constraints.length == 0
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
            let toViewName = constraint.toView.isClassComponent ? "self" : constraint.toView.name
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

    /**
     * Utils
     */

    getEnumKeyForValue(enum_: any, value: any): string {
        let enumKeys = Object.keys(enum_).filter(key => isNaN(parseInt(key, 10)))

        return enumKeys.filter(key => enum_[key] == value)[0]
    }
}
