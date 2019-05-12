import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UILabel extends UIView {
    name: string = "label"
    className: string = "UILabel"

    @attribute(String, "文本")
    text: string | null = null

    @attribute(UIColor, "文本颜色")
    textColor: UIColor | null = null

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = `let ${this.name} = UILabel()`

        codes += `\n${this.name}.text = "${this.text || ''}"`

        let colorCodes = (this.textColor || UIColor.black).codes()
        codes += `\n${this.name}.textColor = ${colorCodes}`

        return codes
    }
}