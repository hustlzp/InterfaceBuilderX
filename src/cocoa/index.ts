import { UIView } from './UIView';
import { UILabel } from './UILabel';
import { UIButton } from './UIButton';
import { UIImageView } from './UIImageView';
import { UITableView } from './UITableView';
import { UIStackView } from './UIStackView';
import { UITextField } from './UITextField';
import { UITableViewCell } from './UITableViewCell';
import { UITextView } from './UITextView';
import { UICollectionView } from './UICollectionView';

export * from './UIView'
export * from './UILabel'
export * from './UIButton'
export * from './UIImageView'
export * from './UITableView'
export * from './UITableViewCell'
export * from './UITextField'
export * from './AutoLayout'
export * from './UIStackView'
export * from './UITextView'
export * from './UICollectionView'

export const ViewClasses: { new(): UIView }[] = [
    UIView,
    UILabel,
    UIButton,
    UIImageView,
    UITableView,
    UITableViewCell,
    UIStackView,
    UITextField,
    UITextView,
    UICollectionView
]