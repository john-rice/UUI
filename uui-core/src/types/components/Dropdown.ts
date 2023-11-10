import React from 'react';
import { Modifier } from 'react-popper';
import { Placement, Boundary } from '@popperjs/core';
import { IDropdownBodyProps, IDropdownToggler } from '../props';
import { IEditable, IHasForwardedRef } from '../../../src/types/props';

export interface DropdownBodyProps extends IDropdownBodyProps {}

export type DropdownPlacement = Placement;

export interface DropdownProps extends Partial<IEditable<boolean>>, IHasForwardedRef<HTMLElement> {
    renderTarget: (props: IDropdownToggler) => React.ReactNode;
    renderBody: (props: DropdownBodyProps) => React.ReactNode;
    onClose?: () => void;
    isNotUnfoldable?: boolean;
    zIndex?: number;
    placement?: DropdownPlacement;
    modifiers?: Modifier<any>[];
    /** Should we close dropdown on click on the Toggler, if it's already open? Default is true. */

    openDelay?: number; // default: 0
    closeDelay?: number; // default: 0
    openOnClick?: boolean; // default: true
    openOnHover?: boolean; // default: false
    closeOnTargetClick?: boolean; // default: true
    closeOnClickOutside?: boolean; // default: true
    closeOnMouseLeave?: 'toggler' | 'boundary' | false;

    portalTarget?: HTMLElement;
    boundaryElement?: Boundary;

    closeBodyOnTogglerHidden?: boolean; // default: true; Set false if you do not want to hide the dropdown body in case Toggler is out of the viewport
}
