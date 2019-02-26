import * as cli from '@angular/cli';
// import { Observable } from 'rxjs';

/*
function ngCli(cliArgs: string[]): Observable<number> {
    return new Observable<number>(observer => {
        cli.default({ cliArgs: cliArgs })
            .then((response) => {
                observer.next(response);
                observer.complete();
            })
            .catch((error) => {
                observer.error(error);
            });
        });
}
*/

// testing
console.log('start test syncNgCli');
let cmdChain = [['help'], ['help']];
chainNgCmds(cmdChain);


function chainNgCmds(cmdChain: string[][], chainIndex?: number) {
    let index = 0;

    if (chainIndex) {
        if (cmdChain.length === chainIndex) { return; }
        index = chainIndex;
    }
/*
    ngCli(cmdChain[index]).subscribe(
        response => console.log(response),
        error => console.log(error),
        () => chainNgCmds(cmdChain, index + 1)
    );
*/

    cli.default({ cliArgs: cmdChain[index] })
        .then(() => chainNgCmds(cmdChain, index + 1))
        .catch((error) => console.log('chainNgCmds ERROR = ', error));

}

