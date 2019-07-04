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

    @attribute(Number, "字间距")
    letterSpacing: number = 0

    @attribute(String, "Action")
    action: string | null = null

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        // 图片
        if (this.image || this.highlightedImage) {
            if (this.image) {
                codes += `\n${prefix}setImage(${this.image.codes}, for: .normal)`
            }

            // Highlighted Image
            if (this.highlightedImage) {
                codes += `\n${prefix}setImage(${this.highlightedImage.codes}, for: .highlighted)`
            }
        } else {    // 文本
            let colorCodes = (this.titleColor || UIColor.black).codes
            
            if (this.letterSpacing == 0) {
                codes += `\n${prefix}setTitle("${this.title || ""}".localized(), for: .normal)`
                codes += `\n${prefix}setTitleColor(${colorCodes}, for: .normal)`
            } else {
                codes += `\n${prefix}setAttributedTitle(NSAttributedString(string: "${this.title || ""}", attributes: [.kern: ${this.letterSpacing}, .foregroundColor: ${colorCodes}]), for: .normal)`
            }
        }

        // Action
        let action = `#selector(${this.action || ''})`
        codes += `\n${prefix}addTarget(self, action: ${action}, for: .touchUpInside)`

        // font
        codes += `\n${prefix}titleLabel?.font = ${this.font.codes}`

        return codes
    }

}
