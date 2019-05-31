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

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        codes += `\n${this.name}.axis = .${this.getEnumKeyForValue(LayoutAxis, this.axis)}`
        if (this.distribution != UIStackViewDistribution.fill) {
            codes += `\n${this.name}.distribution = .${this.getEnumKeyForValue(UIStackViewDistribution, this.distribution)}`
        }
        if (typeof this.spacing == "number") {
            codes += `\n${this.name}.spacing = ${this.spacing}`
        }

        return codes
    }

    viewCodes(superview: UIView | null): string {
        let codes = ""

        if (!this.isComponent && !this.asFunction && !this.isComponentInstance) {
            codes += this.subviewsViewCodes()
        }

        codes += "\n\n"
        codes +=
            this.asFunction ?
                `let ${this.name} = create${capitalize(this.name!)}()` :
                this.isComponent ?
                    `let ${this.name} = create${capitalize(this.componentName!)}()` :
                    this.isComponentInstance ?
                        `let ${this.name} = create${capitalize(this.component!.componentName!)}()` :
                        this.selfViewCodes()

        if (superview) {
            codes += `\n${superview.name}.addSubview(${this.name})`
        }

        return codes
    }

    selfComponentCodes(): string {
        var codes = ""

        if (this.isComponent || this.asFunction) {
            let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
            codes += `private func create${componentName}() -> ${this.className} {`

            codes += indent(this.subviewsViewCodes().substr(1))

            codes += "\n\n"
            codes += indent(this.selfViewCodes())

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

}
