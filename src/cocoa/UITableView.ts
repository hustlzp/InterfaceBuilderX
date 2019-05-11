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

    constructor() {
        super()
    }

    codes(superview: UIView | null): string {
        let codes = `let ${this.name} = UITableView()`

        codes += `${this.name}.delegate = self
tableView.dataSource = self
tableView.tableFooterView = UIView(frame: CGRect(x: 0, y: 0, width: 0, height: ${this.footerHeight || 0}))
tableView.estimatedRowHeight = ${this.estimatedRowHeight}
tableView.register(${this.cellClass || 'UITableViewCell'}.self, forCellReuseIdentifier: "${this.cellReuseIdentifier || 'cellReuseIdentifier'}")`

        if (superview) {
            codes += `\n${superview.name}.addSubview(${this.name})`
        }

        return codes
    }
}