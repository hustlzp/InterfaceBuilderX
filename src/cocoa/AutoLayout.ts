import { UIView } from '@/cocoa/UIView';
import uuidv4 from 'uuid/v4';

export enum AutoLayoutAttribute {
    width = "width",
    height = "height",
    centerX = "centerX",
    centerY = "centerY",
    center = "center",
    left = "left",
    top = "top",
    right = "right",
    bottom = "bottom",
    edges = "edges"
}

export enum AutoLayoutRelation {
    equal = 0,
    lessThanOrEqual = -1,
    greaterThanOrEqual = 1
}

export class AutoLayoutConstraint {
    id!: string
    view!: UIView
    attribute!: AutoLayoutAttribute
    relation: AutoLayoutRelation
    toView: UIView | null = null
    toAttribute: AutoLayoutAttribute | null = null
    multiplier: number | null = null
    constant: number | null = null

    constructor(view: UIView, attribute: AutoLayoutAttribute, relation: AutoLayoutRelation, toView: UIView | null, toAttribute: AutoLayoutAttribute | null, multiplier: number | null, constant: number | null) {
        this.id = uuidv4()
        this.view = view
        this.attribute = attribute
        this.relation = relation
        this.toView = toView
        this.toAttribute = toAttribute
        this.multiplier = multiplier
        this.constant = constant
    }



}
