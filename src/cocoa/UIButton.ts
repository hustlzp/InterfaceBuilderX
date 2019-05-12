import { UIView, attribute, UIFont, UIColor } from './UIView';
import { capitalize } from '@/utils';

export class UIButton extends UIView {
    name: string = "button"
    // get name(): string {
    //     return this._name
    // }
    // set name(newValue: string) {
    //     this._name = newValue
    //     if (!this.action) {
    //         this.action = `${this.name}Tapped`
    //     }
    // }
    className: string = "UIButton"

    @attribute(String, "文本")
    title: string | null = null

    @attribute(UIColor, "文本颜色")
    titleColor: UIColor | null = UIColor.black

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    @attribute(String, "Action")
    action: string | null = null

    constructor(subviews: UIView[]) {
        super(subviews)

        this.watch
    }

    selfViewCodes(): string {
        var codes = `let ${this.name} = UIButton()`

        // 标题
        codes += `\n${this.name}.setTitle("${this.title || ""}", for: .normal)`

        // 颜色
        let colorCodes = (this.titleColor || UIColor.black).codes
        codes += `\n${this.name}.setTitleColor(${colorCodes}, for: .normal)`

        // Action
        let action = this.action ? `#selector(${this.action})` : "nil"
        codes += `\n${this.name}.addTarget(self, action: ${action}, for: .touchUpInside)`

        // font
        codes += `\n${this.name}.titleLabel?.font = ${this.font.codes}`

        return codes
    }

}
