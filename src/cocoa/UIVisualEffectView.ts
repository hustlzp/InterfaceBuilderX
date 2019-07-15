import { UIView } from './UIView';

export class UIVisualEffectView extends UIView {
    name: string = "visualEffectView"
    className: string = "UIVisualEffectView"

    selfViewCodes(): string {
        let codes = ""

        if (!this.isClassComponent) {
            if (!this.isClassProperty) {
                codes += "let "
            }
            codes += `${this.name} = ${this.className}(effect: nil)`
        }

        // let prefix = this.isClassComponent ? "" : `${this.name}.`

        return codes
    }

}