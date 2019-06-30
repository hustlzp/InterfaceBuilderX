import { UIColor, UIView, UIFont, attribute, enumAttribute, UIEdgeInsets } from './UIView';
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
    axis: LayoutAxis = LayoutAxis.horizontal

    @enumAttribute(UIStackViewDistribution, "Distribution")
    distribution: UIStackViewDistribution = UIStackViewDistribution.fill

    @attribute(UIEdgeInsets, "layoutMargins")
    layoutMargins: UIEdgeInsets | null = null

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        codes += `\n${prefix}axis = .${this.getEnumKeyForValue(LayoutAxis, this.axis)}`
        if (this.distribution != UIStackViewDistribution.fill) {
            codes += `\n${prefix}distribution = .${this.getEnumKeyForValue(UIStackViewDistribution, this.distribution)}`
        }
        if (typeof this.spacing == "number") {
            codes += `\n${prefix}spacing = ${this.spacing}`
        }
        if (this.layoutMargins) {
            codes += `\n${prefix}isLayoutMarginsRelativeArrangement = true`
            codes += `\n${prefix}layoutMargins = ${this.layoutMargins.codes}`
        }

        return codes
    }

}
