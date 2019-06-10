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
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        if (this.image) {
            codes += `${prefix}image = ${this.image.codes}`
        }

        return codes
    }
}
