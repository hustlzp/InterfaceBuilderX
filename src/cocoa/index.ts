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
import { UIScrollView } from './UIScrollView';
import { UICollectionViewCell } from './UICollectionViewCell';
import { UITableViewHeaderFooterView } from './UITableViewHeaderFooterView'
import { UIPickerView } from './UIPickerView';
import { UICollectionReusableView } from './UICollectionReusableView';
import { UIVisualEffectView } from './UIVisualEffectView';

export * from './UIView'
export * from './UILabel'
export * from './UIButton'
export * from './UIImageView'
export * from './UITableView'
export * from './UITableViewCell'
export * from './UITableViewHeaderFooterView'
export * from './UITextField'
export * from './AutoLayout'
export * from './UIStackView'
export * from './UITextView'
export * from './UICollectionView'
export * from './UICollectionViewCell'
export * from './UICollectionReusableView'
export * from './UIScrollView'
export * from './UIPickerView'
export * from './UIVisualEffectView'

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
    UIScrollView,
    UICollectionView,
    UICollectionViewCell,
    UICollectionReusableView,
    UITableViewHeaderFooterView,
    UIPickerView,
    UIVisualEffectView
]
