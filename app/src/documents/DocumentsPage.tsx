import React, { useEffect } from 'react';
import { TreeNodeProps } from '@epam/uui-components';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { UUI4 } from '../common';
import { items } from './structure';
import { getQuery } from '../helpers';
import { join } from 'path';

const itemsIds = items.map(i => i.id);

export const DocumentsPage = () => {
    if (!itemsIds.includes(getQuery('id'))) {
        svc.uuiRouter.redirect({ pathname: '/documents', query: { id: items[0].id, mode: 'doc', skin: UUI4 } });
    }

    const onChange = (val: TreeNodeProps) => {
        if (val.parentId === 'components') {
            svc.uuiRouter.redirect({ pathname: '/documents', query: { id: val.id, mode: getQuery('mode') || 'doc', skin: getQuery('skin') || UUI4, category: val.parentId } });
        } else {
            svc.uuiRouter.redirect({ pathname: '/documents', query: { id: val.id, category: val.parentId } });
        }
    };

    const selectedDocId = getQuery('id');
    const doc = items.find(i => i.id === selectedDocId);


    useEffect(() => {
        const getCodesandboxFile = (file: string) => join('..', 'data', 'codesandbox', file);
        const codesandboxFiles: string[] = [
            'index.html',
            'services.ts',
            'index.tsx',
            'package.json',
            'tsConfig.json'
        ];

        Promise.all(codesandboxFiles.map(codesandboxFile => {
            return svc.api.getCode({ path: getCodesandboxFile(codesandboxFile) })
        }))
            .then(data => data.map(file => file.raw))
            .then(([ indexHTML, servicesTS, indexTSX, packageJSON, tsConfigJSON ]) => {
                Object.assign(svc, {
                    uuiApp: {
                        codesandboxFiles: { indexHTML, servicesTS, indexTSX, packageJSON, tsConfigJSON }
                    }
                });
            });
    }, []);

    return (
        <Page renderHeader={ () => <AppHeader /> } >
            <FlexRow alignItems='stretch'>
                <Sidebar
                    value={ selectedDocId }
                    onValueChange={ onChange }
                    items={ items }
                    getItemLink={ (item) => !item.isDropdown && {
                        pathname: 'documents',
                        query: {
                            id: item.id,
                            mode: item.parentId && svc.uuiRouter.getCurrentLink().query.mode || 'doc',
                            skin: item.parentId && svc.uuiRouter.getCurrentLink().query.skin || UUI4,
                            category: item.parentId && item.parentId,
                        },
                    } }
                />
                { React.createElement(doc.component) }
            </FlexRow>
        </Page>
    );
};