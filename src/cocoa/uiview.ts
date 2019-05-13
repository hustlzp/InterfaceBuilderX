import "reflect-metadata";
import uuidv4 from 'uuid/v4';
import { capitalize, indent } from '@/utils';
import { AutoLayoutAttribute, AutoLayoutConstraint, AutoLayoutRelation } from '@/cocoa/AutoLayout'

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
    isComponent: boolean = false
    constraints: AutoLayoutConstraint[] = []

    constructor(subviews: UIView[] = []) {
        this.subviews = subviews

        subviews.forEach(subview => {
            subview.superview = this
        })
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

    // addConstraint(attribute: AutoLayoutAttribute, relation: AutoLayoutRelation, toView: UIView | null, toAttribute: AutoLayoutAttribute | null, multiplier: number | null, constant: number | null) {
    //     let constraint = new AutoLayoutConstraint(this, attribute, relation, toView, toAttribute, multiplier, constant)

    //     this.constraints.push(constraint)
    // }

    addConstraint(constraint: AutoLayoutConstraint) {
        this.constraints.push(constraint)
    }

    codes(): string {
        var codes = this.viewCodes(null)

        if (this.subviews.length > 0 && !this.isComponent) {
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

        // 自身约束代码
        if (this.constraints.length > 0) {
            codes += `${this.name}.snp.makeConstraints { (make) in`

            for (const constraint of this.constraints) {
                codes += `\n    make.${this.constraintCodes(constraint)}`
            }

            codes += "\n}"
        }
        // if (superview) {
        //     codes += `${this.name}.snp.makeConstraints { (make) in`
        //     codes += `\n    make.edges.equalTo(${superview.name})`
        //     codes += "\n}"
        // }

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
            codes += indent(this.viewCodesInComponent())

            if (this.subviews.length > 0) {
                codes += "\n\n    // 约束"
                codes += indent(this.layoutCodesInComponent())
            }

            codes += indent(`\n\nreturn ${this.name}`)
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
                codes += `.${constraint.toAttribute})`
            } else {
                codes += ")"
            }

            if (constraint.constant) {
                codes += `.offset(${constraint.constant})`
            }
        } else if (constraint.constant) {
            codes += `(${constraint.constant})`
        }

        if (constraint.multiplier) {
            codes += `.multipliedBy(${constraint.multiplier})`
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
                codes += `.${constraint.toAttribute})`
            } else {
                codes += ""
            }

            if (constraint.constant) {
                codes += ` + ${constraint.constant}`
            }
        } else if (constraint.constant) {
            codes += ` ${constraint.constant}`
        }

        if (constraint.multiplier) {
            codes += ` * ${constraint.multiplier}`
        }

        return codes
    }
}
