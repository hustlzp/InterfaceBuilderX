import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UIImageView extends UIView {
    name: string = "imageView"
    className: string = "UIImageView"

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = `let ${this.name} = UIImageView()`
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        return codes
    }
}
