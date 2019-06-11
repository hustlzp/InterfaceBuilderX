import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UICollectionView extends UIView {
    name: string = "collectionView"
    className: string = "UICollectionView"

    @attribute(String, "Cell Identifier")
    cellReuseIdentifier: string = "cellReuseIdentifier"

    @attribute(String, "Cell Class")
    cellClass: string = "UICollectionViewCell"

    @attribute(Number, "Item Size Width")
    itemSizeWidth: number = 0

    @attribute(Number, "Line Spacing")
    minimumLineSpacing: number = 0

    @attribute(Number, "Interitem Spacing")
    minimumInteritemSpacing: number = 0

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        let prefix = this.isClassComponent ? "" : `${this.name}.`

        codes += `\n${prefix}delegate = self
${prefix}dataSource = self
${prefix}register(${this.cellClass || 'UICollectionViewCell'}.self, forCellReuseIdentifier: "${this.cellReuseIdentifier || 'cellReuseIdentifier'}")`

        codes += `\n\nlet layout = UICollectionViewFlowLayout()
layout.itemSize = CGSize(width: ${this.itemSizeWidth}, height: ${this.itemSizeHeight})
layout.minimumLineSpacing = ${this.minimumLineSpacing}
layout.minimumInteritemSpacing = ${this.minimumInteritemSpacing}
layout.sectionInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
${prefix}collectionViewLayout = layout
`

        return codes
    }
}
