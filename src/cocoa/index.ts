import { UIView } from './UIView';
import { UILabel } from './UILabel';
import { UIButton } from './UIButton';
import { UIImageView } from './UIImageView';
import { UITableView } from './UITableView';
import { UIStackView } from './UIStackView';
import { UITextField } from './UITextField';

export * from './UIView'
export * from './UILabel'
export * from './UIButton'
export * from './UIImageView'
export * from './UITableView'
export * from './UITextField'
export * from './AutoLayout'
export * from './UIStackView'

export const ViewClasses: { new(): UIView }[] = [
    UIView,
    UILabel,
    UIButton,
    UIImageView,
    UITableView,
    UIStackView,
    UITextField
]