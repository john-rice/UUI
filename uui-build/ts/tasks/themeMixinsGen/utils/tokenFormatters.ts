import { figmaVarComparator } from '../../themeTokensGen/utils/sortingUtils';
import { GROUPS_CONFIG, TMainGroupConfig, TOKENS_MIXIN_NAME, TVar, TVarGroup } from '../constants';
import { IThemeVar } from '../../themeTokensGen/types/sharedTypes';

export function formatVarsAsMixin(params: { scssVars: TVar[], cssVars: TVar[] }): string {
    const { cssVars, scssVars } = params;

    // SCSS
    const scssVarsSorted = sortVariablesArr(scssVars);
    const scssVarsFormatted = formatBlockOfVariables({ arr: scssVarsSorted, indent: 0, title: 'Private Figma vars' }) || undefined;

    // CSS
    const cssVarsSortedAll = sortVariablesArr(cssVars);

    const cssVarsPublishedGrouped = groupVars(cssVarsSortedAll);
    const cssVarsPublishedGroupedFormatted = formatGroupedVars(cssVarsPublishedGrouped, 1);

    return [
        '// This file is AUTOGENERATED from Figma',
        scssVarsFormatted,
        '',
        `@mixin ${TOKENS_MIXIN_NAME} {`,
        '',
        cssVarsPublishedGroupedFormatted,
        '}',
    ].filter((i) => typeof i === 'string').join('\n');
}

function getVarGroupId(token: IThemeVar) {
    return Object.keys(GROUPS_CONFIG).find((key) => {
        const { condition } = GROUPS_CONFIG[key];
        return condition(token);
    }) as string;
}

function groupVars(vars: TVar[]): Record<string, TVarGroup> {
    return Object.keys(GROUPS_CONFIG).reduce<Record<string, TVarGroup>>((acc, groupId) => {
        vars.forEach((item) => {
            const varGroupId = getVarGroupId(item.token);
            if (groupId === varGroupId) {
                if (!acc[groupId]) {
                    acc[groupId] = { title: GROUPS_CONFIG[groupId].title, items: [] };
                }
                acc[groupId].items.push(item);
            }
        });
        return acc;
    }, {});
}

function formatGroupedVars(grouped: Record<string, TVarGroup>, indent: number): string {
    const createInnerGroups = (arr: TVar[], mainGroupCfg: TMainGroupConfig) => {
        const innerGroups: Record<string, { title: string, items: TVar[] }> = {};
        arr.forEach((v) => {
            const groupId = mainGroupCfg.getInnerGroupId(v);
            if (!innerGroups[groupId]) {
                innerGroups[groupId] = { title: mainGroupCfg.showInnerGroupTitle ? groupId : '', items: [] };
            }
            innerGroups[groupId].items.push(v);
        });
        return innerGroups;
    };

    return Object.keys(grouped).reduce((acc, groupId, currentIndex) => {
        const block = grouped[groupId];
        const innerGroups = createInnerGroups(block.items, GROUPS_CONFIG[groupId]);
        const innerGroupsFormatted = Object.values(innerGroups).map((ig) => {
            return formatBlockOfVariables({ arr: ig.items, indent, title: ig.title });
        }).join('\n\n');
        return acc + (currentIndex === 0 ? '' : '\n\n') + wrapBlockInComments({ str: innerGroupsFormatted, groupName: block.title, indent, compact: false });
    }, '');
}

function formatBlockOfVariables(params: { arr: TVar[], indent: number, title: string }): string {
    const { arr, title, indent } = params;
    const group = arr.map(({ name, value }) => {
        return `${getIndent(indent)}${name}: ${value};`;
    }).join('\n');
    return wrapBlockInComments({ str: group, groupName: title, indent, compact: true });
}

function getIndent(indent: number): string {
    return new Array(4 * indent).fill(' ').join('');
}

function sortVariablesArr(arr: TVar[]) {
    return [...arr].sort((e1, e2) => figmaVarComparator(e1.token.cssVar as string, e2.token.cssVar as string));
}

function wrapBlockInComments(params: { str: string, groupName: string, indent: number, compact: boolean }) {
    const { str, groupName, indent, compact } = params;
    if (str.trim() === '') {
        return '';
    }
    const I = getIndent(indent);
    let start;
    if (compact) {
        start = `${I}// "${groupName}"`;
    } else {
        const line = `/*** ${groupName} ***/`;
        const padding = `/${Array(line.length - 2).fill('*').join('')}/`;
        start = [padding, line, padding].map((l) => `${I}${l}`).join('\n') + '\n';
    }

    return [
        start,
        str,
    ].join('\n');
}