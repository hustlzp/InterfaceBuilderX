import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UILabel extends UIView {
    name: string = "label"
    className: string = "UILabel"

    @attribute(String, "文本")
    text: string | null = null

    @attribute(UIColor, "文本颜色")
    textColor: UIColor | null = UIColor.black

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    @attribute(Number, "字间距")
    letterSpacing: number = 0

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = `let ${this.name} = UILabel()`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        // textColor
        let colorCodes = (this.textColor || UIColor.black).codes
        codes += `\n${this.name}.textColor = ${colorCodes}`

        // font
        codes += `\n${this.name}.font = ${this.font.codes}`

        let textCodes = `"${this.text || ''}".localized()`
        if (this.letterSpacing > 0) {
            // attributed text

            // letter spacing
            codes += `\n${this.name}.attributedText = NSAttributedString(string: ${textCodes}, attributes: [.kern: ${this.letterSpacing}])`
        } else {
            // plain text
            codes += `\n${this.name}.text = ${textCodes}`
        }

        return codes
    }
}