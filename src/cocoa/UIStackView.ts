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
        let codes = this.isClassComponent ? "" : `let ${this.name} = ${this.className}()`
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

    // viewCodes(superview: UIView | null): string {
    //     let codes = ""

    //     if (!this.isComponent && !this.isComponentInstance) {
    //         codes += this.subviewsViewCodes()
    //     }

    //     codes += "\n\n"
    //     if (this.isComponent || this.isComponentInstance) {
    //         let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)

    //         if (this.isClassComponent || (this.component && this.component.isClassComponent)) {
    //             codes += `let ${this.name} = create${componentName}()`
    //         } else {
    //             codes += `let ${this.name} = ${componentName}()`
    //         }
    //     } else {
    //         codes += this.selfViewCodes()
    //     }

    //     if (superview) {
    //         if (superview.className == "UIStackView") {
    //             codes += `\n${prefix}addArrangedSubview(${this.name})`
    //         } else {
    //             codes += `\n${prefix}addSubview(${this.name})`
    //         }
    //         codes += `\n${superview.name}.addSubview(${this.name})`
    //     }

    //     return codes
    // }

    // selfFunctionComponentCodes(): string {
    //     if (!this.isFunctionComponent) {
    //         return ""
    //     }

    //     let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
    //     let codes = `private func create${componentName}() -> ${this.className} {`

    //     // View Creation Codes
    //     let viewCreationCodes = this.subviewsViewCodes()
    //     viewCreationCodes += "\n\n"
    //     viewCreationCodes += this.selfViewCodes()
    //     if (this.subviews.length > 0
    //         || (this.isComponent && this.constraints.length > 0)) {
    //         viewCreationCodes += "\n\n// 约束"

    //         if (this.isComponent) {
    //             viewCreationCodes += "\n\n"
    //             viewCreationCodes += this.selfLayoutCodes()
    //         }

    //         viewCreationCodes += this.subviewsLayoutCodes()
    //     }

    //     codes += "\n"
    //     codes += indent(viewCreationCodes)
    //     codes += indent(`\n\nreturn ${this.name}`)
    //     codes += "\n}"

    //     return codes
    // }

    // selfClassComponentCodes(): string {
    //     if (!this.isClassComponent) {
    //         return ""
    //     }

    //     let componentName = this.isRoot ? capitalize(this.name) : capitalize(this.componentName!)
    //     let codes = `class ${componentName}: ${this.className} {`

    //     // View Creation Codes
    //     let viewCreationCodes = this.subviewsViewCodes()
    //     viewCreationCodes += "\n\n"
    //     viewCreationCodes += this.selfViewCodes()
    //     if (this.subviews.length > 0
    //         || (this.isComponent && this.constraints.length > 0)) {
    //         viewCreationCodes += "\n\n// 约束"

    //         if (this.isComponent) {
    //             viewCreationCodes += "\n\n"
    //             viewCreationCodes += this.selfLayoutCodes()
    //         }

    //         viewCreationCodes += this.subviewsLayoutCodes()
    //     }

    //     codes += indent("\n\noverride init(frame: CGRect) {")
    //     codes += indent("\nsuper.init(frame: frame)", 2)
    //     codes += "\n\n"
    //     codes += indent(viewCreationCodes, 2)
    //     codes += indent("\n}")
    //     codes += "\n\n"
    //     codes += indent("required init?(coder aDecoder: NSCoder) {")
    //     codes += indent(`\nfatalError("init(coder:) has not been implemented")`, 2)
    //     codes += indent("\n}")
    //     codes += indent(this.subviewsFunctionComponentCodes())
    //     codes += "\n}"

    //     return codes
    // }

}
