import * as cli from '@angular/cli';

// testing
console.log('start test syncNgCli');
let cmdChain = [['help'], ['help']];
chainNgCliCmds(cmdChain);

/**
 * Chains Commands
 * @param cmdChain [['cmd1arg1', 'cmd1arg2'], ..., ['cmd(n)arg1',...,  'cmd(n)arg(m)'] ] 
 * @param chainIndex?
 */
export function chainNgCliCmds(cmdChain: string[][], chainIndex?: number) {
    let index = 0;

    if (chainIndex) {
        if (cmdChain.length === chainIndex) { return; }
        index = chainIndex;
    }

    cli.default({ cliArgs: cmdChain[index] })
        .then(() => chainNgCliCmds(cmdChain, index + 1))
        .catch((error) => console.log('chainNgCmds ERROR = ', error));

}

