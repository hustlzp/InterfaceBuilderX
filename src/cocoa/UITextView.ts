import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UITextView extends UIView {
    name: string = "textView"
    className: string = "UITextView"

    @attribute(String, "文本")
    text: string | null = null

    @attribute(String, "Placeholder")
    placeholder: string | null = null

    @attribute(UIColor, "文本颜色")
    textColor: UIColor | null = null

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = this.isClassComponent ? "" : `let ${this.name} = ${this.className}()`
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        codes += `\n${prefix}placeholder = "${this.placeholder || ''}".localized()`
        codes += `\n${prefix}text = "${this.text || ''}".localized()`

        if (this.textColor) {
            codes += `\n${prefix}textColor = ${this.textColor.codes}`
        }

        // font
        codes += `\n${prefix}font = ${this.font.codes}`

        return codes
    }
}