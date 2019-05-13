import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UIImageView extends UIView {
    name: string = "imageView"
    className: string = "UIImageView"

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = `let ${this.name} = UIImageView()`

        if (this.backgroundColor) {
            codes += `\n${this.name}.backgroundColor = ${this.backgroundColor.codes}`
        }

        return codes
    }
}
