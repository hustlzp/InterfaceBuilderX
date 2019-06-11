import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UIScrollView extends UIView {
    name: string = "scrollView"
    className: string = "UIScrollView"

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        // let prefix = this.isClassComponent ? "" : `${this.name}.`

        return codes
    }
}