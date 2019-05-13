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

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = `let ${this.name} = UILabel()`

        // text
        codes += `\n${this.name}.text = "${this.text || ''}".localized()`

        // textColor
        let colorCodes = (this.textColor || UIColor.black).codes
        codes += `\n${this.name}.textColor = ${colorCodes}`

        if (this.backgroundColor) {
            codes += `\n${this.name}.backgroundColor = ${this.backgroundColor.codes}`
        }

        // font
        codes += `\n${this.name}.font = ${this.font.codes}`

        return codes
    }
}