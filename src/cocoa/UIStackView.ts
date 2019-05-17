import { UIColor, UIView, UIFont, attribute } from './UIView';
import { capitalize } from '@/utils';

export class UIStackView extends UIView {
    name: string = "stackView"
    className: string = "UIStackView"

    @attribute(Number, "Spacing")
    spacing: number = 0

    selfViewCodes(): string {
        let codes = `let ${this.name} = UIStackView(arrangedSubviews: [${this.subviews.map(subview => subview.name).join(', ')}])`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        codes += `\n${this.name}.axis = .vertical`
        codes += `\n${this.name}.spacing = ${this.spacing}`

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
}
