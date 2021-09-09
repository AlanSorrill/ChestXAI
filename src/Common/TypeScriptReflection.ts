import ts from "typescript";
import Path from 'path'
import fs from 'fs';


export class TSReflection {
    fileNames: string[];
    options: ts.CompilerOptions;
    program: ts.Program;
    successfulBuild: boolean = false;
    sourceFiles: readonly ts.SourceFile[];
    constructor() {
        let configPath = Path.join(__dirname, '../../tsconfig.json')
        let srcPath = Path.join(__dirname, '../../src/');
        let data = fs.readFileSync(configPath);
        let config = JSON.parse(data as any);

        this.fileNames = TSReflection.recursivlyFindFiles(srcPath);
        this.options = config;
    }
    private static recursivlyFindFiles(directoryPath: string, arr: string[] = []): string[] {
        if (fs.existsSync(directoryPath)) {
            let stats = fs.lstatSync(directoryPath);
            if (stats.isDirectory()) {
                fs.readdirSync(directoryPath).forEach((value: string) => {
                    TSReflection.recursivlyFindFiles(Path.join(directoryPath, value), arr);
                })
            } else {
                arr.push(directoryPath);
            }
        }
        return arr;
    }
    compile(): void {
        this.program = ts.createProgram(this.fileNames, this.options);

        this.sourceFiles = this.program.getSourceFiles();



        // let emitResult = this.program.emit();

        // let allDiagnostics = ts
        //     .getPreEmitDiagnostics(this.program)
        //     .concat(emitResult.diagnostics);

        // allDiagnostics.forEach(diagnostic => {
        //     if (diagnostic.file) {
        //         let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
        //         let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        //         console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        //     } else {
        //         console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        //     }
        // });

        // this.successfulBuild = emitResult.emitSkipped ? true : false;

    }
}