import { UIColor, UIView, UIFont, attribute, enumAttribute } from './UIView';
import { capitalize, indent } from '@/utils';

enum LayoutAxis {
    vertical,
    horizontal
}

enum UIStackViewDistribution {
    fill,
    fillEqually,
    fillProportionally,
    equalSpacing,
    equalCentering
}

export class UIStackView extends UIView {
    name: string = "stackView"
    className: string = "UIStackView"

    @attribute(Number, "Spacing")
    spacing: number = 0

    @enumAttribute(LayoutAxis, "Axis")
    axis: LayoutAxis = LayoutAxis.vertical

    @enumAttribute(UIStackViewDistribution, "Distribution")
    distribution: UIStackViewDistribution = UIStackViewDistribution.fill

    selfViewCodes(): string {
        let codes = `let ${this.name} = UIStackView(arrangedSubviews: [${this.subviews.map(subview => subview.name).join(', ')}])`
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        codes += `\n${prefix}axis = .${this.getEnumKeyForValue(LayoutAxis, this.axis)}`
        if (this.distribution != UIStackViewDistribution.fill) {
            codes += `\n${prefix}distribution = .${this.getEnumKeyForValue(UIStackViewDistribution, this.distribution)}`
        }
        if (typeof this.spacing == "number") {
            codes += `\n${prefix}spacing = ${this.spacing}`
        }

        return codes
    }

    viewCodes(superview: UIView | null): string {
        let codes = ""

        if (!this.isComponent && !this.isComponentInstance) {
            codes += this.subviewsViewCodes()
        }

        codes += "\n\n"
        if (this.isComponent || this.isComponentInstance) {
            let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)

            if (this.isClassComponent) {
                codes += `let ${this.name} = create${componentName}()`
            } else {
                codes += `let ${this.name} = ${componentName}()`
            }
        } else {
            codes += this.selfViewCodes()
        }

        if (superview) {
            codes += `\n${superview.name}.addSubview(${this.name})`
        }

        return codes
    }

    selfComponentCodes(): string {
        var codes = ""

        if (this.isComponent) {
            let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
            codes += `private func create${componentName}() -> ${this.className} {`

            codes += indent(this.subviewsViewCodes().substr(1))

            codes += "\n\n"
            codes += indent(this.selfViewCodes())

            if (this.subviews.length > 0) {
                codes += "\n\n    // 约束"

                if (this.isComponent) {
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

}
