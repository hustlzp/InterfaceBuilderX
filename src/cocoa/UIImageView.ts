import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UIImageView extends UIView {
    name: string = "imageView"
    className: string = "UIImageView"

    constructor() {
        super()
    }

    codes(superview: UIView | null): string {
        let codes = `let ${this.name} = UIImageView()`

        if (superview) {
            codes += `\n${superview.name}.addSubview(${this.name})`
        }

        return codes
    }
}
