import React from 'react';
import { Avatar, Badge, FlexCell, FlexRow, LinkButton, Panel, Text } from '@epam/uui';
import { ReactComponent as navigationIcon } from '@epam/assets/icons/common/navigation-chevron-right-12.svg';
import { ReactComponent as notificationIcon } from '@epam/assets/icons/common/notification-done-12.svg';
import css from './CardExample.module.scss';

export default function AttributesExample() {
    return (
        <Panel background="surface" shadow cx={ css.container }>
            <div className={ css.wrapper }>
                <FlexRow>
                    <Avatar size="60" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />
                    <FlexRow padding="12">
                        <FlexCell width="auto">
                            <Text cx={ css.text } lineHeight="24" fontSize="18" color="primary" font="semibold">
                                John Doe
                            </Text>
                            <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                Corporate Function Management | L3
                            </Text>
                        </FlexCell>
                    </FlexRow>
                </FlexRow>
                <FlexRow alignItems="center" columnGap="6">
                    <Badge color="success" size="18" fill="outline" icon={ notificationIcon } caption="Available" />
                    <Badge color="info" size="18" fill="outline" caption="Bench" />
                    <Badge color="warning" size="18" fill="outline" caption="Remote" />
                </FlexRow>
            </div>
            <div className={ css.divider } />
            <div className={ css.wrapper }>
                <FlexRow>
                    <LinkButton caption="Show Reporting Line" link={ { pathname: '/' } } size="24" icon={ navigationIcon } iconPosition="right" />
                </FlexRow>
            </div>
        </Panel>
    );
}
