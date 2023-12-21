import React from 'react';
import css from './colorRectangle.module.scss';
import { LabeledInput, Panel, Tag, Text, Tooltip } from '@epam/uui';
import { hexToRgb } from '../../utils/colorUtils';

export function ColorRectangle(props: { color: string, hex: string }) {
    const style = {
        backgroundColor: `${props.color}`,
    };
    const rgb = hexToRgb(props.hex) || 'n/a';
    const rgbPc = hexToRgb(props.hex, true) || 'n/a';
    const tooltipContent = (
        <Text>
            <LabeledInput label="rgb: " labelPosition="left">
                <span style={ { whiteSpace: 'nowrap' } }>
                    {`${rgb} `}
                </span>
            </LabeledInput>
            <LabeledInput label="rgb(%): " labelPosition="left">
                <span>
                    {`${rgbPc} `}
                </span>
            </LabeledInput>
        </Text>
    );
    const tag = <Tag color="neutral" caption={ props.hex || '<empty>' } size="18" fill="outline" cx={ css.label } />;
    return (
        <Panel style={ style } cx={ [css.root] } shadow={ true }>
            &nbsp;
            { tooltipContent && (
                <Tooltip content={ tooltipContent } closeOnMouseLeave="boundary" color="neutral">
                    {tag}
                </Tooltip>
            )}
            {
                !tooltipContent && tag
            }
        </Panel>
    );
}
