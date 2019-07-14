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

enum UIStackViewAlignment {
    fill,
    leading,
    top,
    firstBaseline,
    center,
    trailing,
    bottom,
    lastBaseline
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

    @enumAttribute(UIStackViewAlignment, "Alignment")
    alignment: UIStackViewAlignment = UIStackViewAlignment.fill

    @attribute(UIEdgeInsets, "Layout Margins")
    layoutMargins: UIEdgeInsets | null = null

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        codes += `\n${prefix}axis = .${this.getEnumKeyForValue(LayoutAxis, this.axis)}`
        if (this.distribution != UIStackViewDistribution.fill) {
            codes += `\n${prefix}distribution = .${this.getEnumKeyForValue(UIStackViewDistribution, this.distribution)}`
        }
        if (this.alignment != UIStackViewAlignment.fill) {
            codes += `\n${prefix}alignment = .${this.getEnumKeyForValue(UIStackViewAlignment, this.alignment)}`
        }
        if (typeof this.spacing == "number" && this.spacing > 0) {
            codes += `\n${prefix}spacing = ${this.spacing}`
        }
        if (this.layoutMargins) {
            codes += `\n${prefix}isLayoutMarginsRelativeArrangement = true`
            codes += `\n${prefix}layoutMargins = ${this.layoutMargins.codes}`
        }

        return codes
    }

}
