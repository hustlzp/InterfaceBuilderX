import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UITableView extends UIView {
    name: string = "tableView"
    className: string = "UITableView"

    @attribute(String, "Cell Identifier")
    cellReuseIdentifier: string = "cellReuseIdentifier"

    @attribute(String, "Cell Class")
    cellClass: string = "UITableViewCell"

    @attribute(Number, "Row Height")
    estimatedRowHeight: number = 100

    @attribute(Number, "Footer Height")
    footerHeight: number = 0

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        codes += `\n${prefix}delegate = self
${prefix}dataSource = self
${prefix}tableFooterView = UIView(frame: CGRect(x: 0, y: 0, width: 0, height: ${this.footerHeight || 0}))
${prefix}estimatedRowHeight = ${this.estimatedRowHeight}
${prefix}register(${this.cellClass || 'UITableViewCell'}.self, forCellReuseIdentifier: "${this.cellReuseIdentifier || 'cellReuseIdentifier'}")`

        return codes
    }
}