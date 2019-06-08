import { UIColor, UIView, UIFont, attribute, UIImage } from './UIView';

export class UIImageView extends UIView {
    name: string = "imageView"
    className: string = "UIImageView"

    // constructor() {
    //     super()
    // }

    @attribute(UIImage, "Image")
    image: UIImage | null = null

    selfViewCodes(): string {
        let codes = this.isClassComponent ? "" : `let ${this.name} = ${this.className}()`
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        if (this.image) {
            codes += `${prefix}image = ${this.image.codes}`
        }

        return codes
    }
}
