import { UIColor, UIView, UIFont, attribute, enumAttribute } from './UIView';
import { indent } from '@/utils';

enum UITableViewCellSelectionStyle {
    none,
    blue,
    gray,
    default
}

enum UITableViewCellAccessoryType {
    none,
    disclosureIndicator,
    detailDisclosureButton,
    checkmark,
    detailButton
}

export class UITableViewCell extends UIView {
    name: string = "tableViewCell"
    className: string = "UITableViewCell"

    @enumAttribute(UITableViewCellSelectionStyle, "Selection style")
    selectionStyle: UITableViewCellSelectionStyle = UITableViewCellSelectionStyle.default

    @enumAttribute(UITableViewCellAccessoryType, "Accessory type")
    accessoryType: UITableViewCellAccessoryType = UITableViewCellAccessoryType.none

    selfViewCodes(): string {
        let codes = this.isClassComponent ? "" : `let ${this.name} = ${this.className}()`
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        let publicAttributesCodes = this.publicSelfViewAttributesCodes()
        if (publicAttributesCodes) {
            codes += publicAttributesCodes
        }

        if (this.selectionStyle != UITableViewCellSelectionStyle.default) {
            codes += `\n${prefix}selectionStyle = .${this.getEnumKeyForValue(UITableViewCellSelectionStyle, this.selectionStyle)}`
        }

        if (this.accessoryType != UITableViewCellAccessoryType.none) {
            codes += `\n${prefix}accessoryType = .${this.getEnumKeyForValue(UITableViewCellAccessoryType, this.accessoryType)}`
        }

        return codes
    }

    classInitCodes(): string {
        let codes = "override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {"
        codes += indent("\nsuper.init(style: style, reuseIdentifier: reuseIdentifier)")

        return codes
    }

}