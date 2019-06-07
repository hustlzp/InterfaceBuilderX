import { UIView, attribute, UIFont, UIColor, UIImage } from './UIView';
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

    @attribute(UIImage, "Image")
    image: UIImage | null = null

    @attribute(UIImage, "Highlighted Image")
    highlightedImage: UIImage | null = null

    @attribute(UIFont, "字体")
    font: UIFont = UIFont.system(17)

    @attribute(String, "Action")
    action: string | null = null

    // constructor(subviews: UIView[]) {
    //     super(subviews)
    // }

    selfViewCodes(): string {
        let codes = this.isClassComponent ? "" : `let ${this.name} = ${this.className}()`
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        if (this.image || this.hi) {
            // 图片
            if (this.image) {
                codes += `\n${prefix}setImage(${this.image.codes}, for: .normal)`
            }

            // Highlighted Image
            if (this.highlightedImage) {
                codes += `\n${prefix}setImage(${this.highlightedImage.codes}, for: .highlighted)`
            }
        } else {
            // 文本
            codes += `\n${prefix}setTitle("${this.title || ""}".localized(), for: .normal)`

            // 文本颜色
            let colorCodes = (this.titleColor || UIColor.black).codes
            codes += `\n${prefix}setTitleColor(${colorCodes}, for: .normal)`
        }

        // Action
        let action = this.action ? `#selector(${this.action})` : "nil"
        codes += `\n${prefix}addTarget(self, action: ${action}, for: .touchUpInside)`

        // font
        codes += `\n${prefix}titleLabel?.font = ${this.font.codes}`

        return codes
    }

}
