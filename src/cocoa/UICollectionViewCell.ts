import { UIColor, UIView, UIFont, attribute } from './UIView';

export class UICollectionViewCell extends UIView {
    name: string = "collectionViewCell"
    className: string = "UICollectionViewCell"
    hasContentView = true

    // constructor() {
    //     super()
    // }

    selfViewCodes(): string {
        let codes = super.selfViewCodes()
        // let prefix = this.isClassComponent ? "" : `${this.name}.`

        return codes
    }
}
