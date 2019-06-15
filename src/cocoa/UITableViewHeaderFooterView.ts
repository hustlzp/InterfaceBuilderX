import { UIColor, UIView, UIFont, attribute } from './UIView';
import { indent } from '@/utils';

export class UITableViewHeaderFooterView extends UIView {
    name: string = "tableHeaderFooterView"
    className: string = "UITableViewHeaderFooterView"
    hasContentView = true

    classInitCodes(): string {
        let codes = "override init(reuseIdentifier: String?) {"
        codes += indent("\nsuper.init(reuseIdentifier: reuseIdentifier)")

        return codes
    }
}