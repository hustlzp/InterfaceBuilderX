import { UIColor, UIView, UIFont, attribute } from './UIView';
import { capitalize } from '@/utils';

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

    @attribute(Number, "行间距")
    lineSpacing: number = 0

    @attribute(Number, "段间距")
    paragraphSpacing: number = 0

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        // textColor
        let colorCodes = (this.textColor || UIColor.black).codes
        codes += `\n${prefix}textColor = ${colorCodes}`

        // font
        codes += `\n${prefix}font = ${this.font.codes}`

        let textCodes = `"${this.text || ''}".localized()`
        if (this.letterSpacing > 0 || this.lineSpacing > 0 || this.paragraphSpacing > 0) {
            var attributes: Attribute[] = []

            if (this.lineSpacing > 0 || this.paragraphSpacing > 0) {
                let paraStyleName = `paraStyleFor${capitalize(this.name)}`
                codes += `\nlet ${paraStyleName} = NSMutableParagraphStyle()`

                if (this.lineSpacing > 0) {
                    codes += `\n${paraStyleName}.lineSpacing = ${this.lineSpacing}`
                }
                if (this.paragraphSpacing > 0) {
                    codes += `\n${paraStyleName}.paragraphSpacing = ${this.paragraphSpacing}`
                }

                attributes.push({ key: ".paragraphStyle", value: paraStyleName })
            }

            if (this.letterSpacing > 0) {
                attributes.push({ key: ".kern", value: this.letterSpacing })
            }

            // letter spacing
            codes += `\n${prefix}attributedText = NSAttributedString(string: ${textCodes}, attributes: [${attributes.map(attribute => `${attribute.key}: ${attribute.value}`).join(', ')}])`
        } else {
            // plain text
            codes += `\n${prefix}text = ${textCodes}`
        }

        return codes
    }
}

interface Attribute {
    key: string
    value: any
}