import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UITextField extends UIView {
    name: string = "textField"
    className: string = "UITextField"

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
        let codes = `let ${this.name} = UITextField()`

        codes += `\n${this.name}.placeholder = "${this.placeholder || ''}"`
        codes += `\n${this.name}.text = "${this.text || ''}"`

        if (this.textColor) {
            codes += `\n${this.name}.textColor = ${this.textColor.codes}`
        }

        // font
        codes += `\n${this.name}.font = ${this.font.codes}`

        return codes
    }
}