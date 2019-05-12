import { UIView, attribute, UIFont, UIColor } from './UIView';

export class UIButton extends UIView {
    name: string = "button"
    className: string = "UIButton"

    @attribute(String, "文本")
    title: string | null = null

    @attribute(UIColor, "文本颜色")
    titleColor: UIColor | null = null

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    @attribute(String, "Action")
    action: string | null = null

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        var codes = `let ${this.name} = UIButton()`

        // 标题
        codes += `\n${this.name}.setTitle("${this.title || ""}", for: .normal)`

        // 颜色
        let colorCodes = (this.titleColor || UIColor.black).codes()
        codes += `\n${this.name}.setTitleColor(${colorCodes}, for: .normal)`

        // Action
        let action = this.action ? `#selector(${this.action})` : "nil"
        codes += `\n${this.name}.addTarget(self, action: ${action}, for: .touchUpInside)`

        return codes
    }

}
