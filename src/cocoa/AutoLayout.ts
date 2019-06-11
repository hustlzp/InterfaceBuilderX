import { UIView, UIEdgeInsets } from '@/cocoa/UIView';
import uuidv4 from 'uuid/v4';
import { IRawParams } from '@/utils';

export enum AutoLayoutAttribute {
    edges = "edges",
    centerX = "centerX",
    centerY = "centerY",
    center = "center",
    left = "left",
    top = "top",
    right = "right",
    bottom = "bottom",
    width = "width",
    height = "height",
}

export enum AutoLayoutRelation {
    equal = 0,
    lessThanOrEqual = -1,
    greaterThanOrEqual = 1
}

export class AutoLayoutConstraint implements IRawParams {
    [key: string]: any

    id!: string
    view!: UIView
    attribute!: AutoLayoutAttribute
    relation: AutoLayoutRelation
    toView: UIView | null = null
    toAttribute: AutoLayoutAttribute | null = null
    multiplier: number | null = null
    constant: number | UIEdgeInsets | null = null

    constructor(view: UIView, attribute: AutoLayoutAttribute, relation: AutoLayoutRelation, toView: UIView | null, toAttribute: AutoLayoutAttribute | null, multiplier: number | null, constant: number | UIEdgeInsets | null) {
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
