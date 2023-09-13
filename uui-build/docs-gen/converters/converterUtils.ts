import { EmitHint, Node, Symbol, SyntaxKind, ts, Type } from 'ts-morph';
import { isExternalFile } from '../utils';
import { getUuiModuleNameFromPath, SYNTAX_KIND_NAMES } from '../constants';

export class ConverterUtils {
    static isExternalNode(typeNode: Node) {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        const symbol = ConverterUtils.getSymbolFromType(type);
        if (!symbol) {
            return false;
        }
        return (symbol.getDeclarations() || []).some((d) => {
            const filePath = d.getSourceFile().compilerNode.fileName;
            return isExternalFile(filePath);
        });
    }

    static getTypeTextFromNode(typeNode: Node) {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        return ConverterUtils.getCompilerTypeText(type);
    }

    static getTypeFromNode(typeNode: Node) {
        const symbol = typeNode.getSymbol();
        if (symbol) {
            const symbolDecls = symbol.getDeclarations();
            return symbolDecls[0].getType();
        }
        return typeNode.getType();
    }

    static getSyntaxKindNameFromNode(node: Node): string {
        const kind = node.getKind();
        return SYNTAX_KIND_NAMES[kind] || String(kind);
    }

    static kindToString(kind: SyntaxKind): string {
        return SYNTAX_KIND_NAMES[kind];
    }

    static getSymbolFromType(type: Type) {
        return type.getSymbol() || type.getAliasSymbol();
    }

    static printNode(node: Node): string[] {
        const printer = ts.createPrinter();
        function removeLeadingExportKw(s: string) {
            return s.replace(/^(export\s+)(type|interface|enum)(.*)$/g, '$2$3');
        }
        return printer.printNode(EmitHint.Unspecified, node.compilerNode, node.getSourceFile().compilerNode)
            .split('\n')
            .map(removeLeadingExportKw);
    }

    static getTypeName(typeSymbol: Symbol) {
        return typeSymbol ? typeSymbol.getEscapedName() : '';
    }

    static getTypeParentRef(typeNode: Node, originTypeNode: Node): { module: string, name: string } | undefined {
        const anc = typeNode.getAncestors().filter((a) => {
            return a !== originTypeNode;
        });
        return ConverterUtils.mapAncestorsToRefs(anc)?.[0];
    }

    static getBaseDeclarationsRefs(typeNode: Node) {
        if (Node.isInterfaceDeclaration(typeNode)) {
            const anc = typeNode.getBaseDeclarations();
            return ConverterUtils.mapAncestorsToRefs(anc);
        }
    }

    private static mapAncestorsToRefs(ancParam: Node[]) {
        const anc = ancParam.filter((a) => {
            return (Node.isTypeAliasDeclaration(a) || Node.isInterfaceDeclaration(a) || Node.isClassDeclaration(a));
        });
        if (anc.length === 0) {
            return;
        }
        return anc.map((ta) => {
            const symbol = ta.getSymbol();
            const module = getUuiModuleNameFromPath(ta.getSourceFile().compilerNode.fileName);
            const name = ConverterUtils.getTypeName(symbol);
            return {
                module,
                name,
            };
        });
    }

    static getCompilerTypeText(type: Type): string {
        return type.getText().replace(/import.*"\)\.*/g, '').replace(/"/g, "'");
    }

    static getCommentFromNode(prop: Node): string[] {
        const ranges = prop.getLeadingCommentRanges();
        if (ranges.length > 0) {
            const closestDoc = ranges[ranges.length - 1].getText().trim();
            const isTsDoc = closestDoc.indexOf('/**') === 0;
            if (isTsDoc) {
                const LF = '\n';
                return closestDoc.split(LF).map(cleanAsteriks).join(LF).trim()
                    .split(LF)
                    .map(formatComment);
            }
        }
        function cleanAsteriks(line: string): string {
            const regex1 = /^([\s]*\/[*]{1,2})(.*)$/; // leading /* or /**
            const regex2 = /^(.*)([\s]*[*]{1,2}\/)$/; // trailing */ or **/
            const regex3 = /^([\s]*[*]{1,1})(.*)$/; // leading *
            return line.replace(regex1, '$2').replace(regex2, '$1').replace(regex3, '$2');
        }
        function formatComment(commentInput: string) {
            // Playground to modify and debug https://regex101.com/r/dd4hyi/1
            const linksRegex = /(?:\[(.*)])?\{\s*@link\s*(https:\/\/\S+?)\s*}/gm;
            let comment = commentInput;
            comment = comment.replace(linksRegex, (_, a, b) => `<a href='${b}'>${a ?? b}</a>`);
            return comment;
        }
    }
}
