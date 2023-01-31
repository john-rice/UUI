import React from 'react';
import { IDropdownToggler } from '@epam/uui-core';
import { DropdownBodyProps } from '@epam/uui-components';
import { Dropdown, DropdownContainer, LinkButton, Panel, Text } from '@epam/promo';
import { ReactComponent as navigationBack } from '@epam/assets/icons/common/navigation-back-18.svg';
import css from './DefaultExample.scss';

export default function DefaultLinkButtonExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => <DropdownContainer { ...props } />;

    return (
        <>
            <Panel cx={ css.components }>
                <LinkButton caption='VIEW DETAILS' link={ { pathname: '/' } } />
                <LinkButton caption='BACK TO CATALOG' link={ { pathname: '/' } }
                    icon={ navigationBack } />
                <Dropdown
                    renderBody={ renderDropdownBody }
                    renderTarget={ (props: IDropdownToggler) => <LinkButton caption='SORT BY'
                    { ...props } /> }
                />
            </Panel>

            <Panel cx={ css.descriptions }>
                <Text>Simple action. Can be used for redirection also</Text>
                <Text>Different icons support meaning of an action. Can be used for redirection or action</Text>
                <Text>Chevron-down icon on the right applies use a link button as a trigger for Picker Dropdown or other overlay component (dropdown menu, popover)</Text>
            </Panel>
        </>
    );
}