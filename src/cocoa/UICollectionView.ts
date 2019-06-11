import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UICollectionView extends UIView {
    name: string = "collectionView"
    className: string = "UICollectionView"

    @attribute(String, "Cell Identifier")
    cellReuseIdentifier: string = "cellReuseIdentifier"

    @attribute(String, "Cell Class")
    cellClass: string = "UICollectionViewCell"

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        codes += `\n${prefix}delegate = self
${prefix}dataSource = self
${prefix}register(${this.cellClass || 'UICollectionViewCell'}.self, forCellReuseIdentifier: "${this.cellReuseIdentifier || 'cellReuseIdentifier'}")`

        return codes
    }
}
