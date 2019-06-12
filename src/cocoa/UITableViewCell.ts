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
    hasContentView: boolean = true

    @enumAttribute(UITableViewCellSelectionStyle, "Selection style")
    selectionStyle: UITableViewCellSelectionStyle = UITableViewCellSelectionStyle.default

    @enumAttribute(UITableViewCellAccessoryType, "Accessory type")
    accessoryType: UITableViewCellAccessoryType = UITableViewCellAccessoryType.none

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

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