import { readFile } from 'fs-extra';
import { STATUS } from '@hydrooj/utils/lib/status';
import { Context } from './interface';

export async function judge({
    next, end, config, code,
}: Context) {
    next({ status: STATUS.STATUS_JUDGING, progress: 0 });
    const answer = ('src' in code)
        ? await readFile(code.src, 'utf-8')
        : ('content' in code)
            ? code.content.toString().replace(/\r/g, '')
            : '';
    const outputs = answer.split('\n');
    let totalScore = 0;
    let totalStatus = 0;
    for (const i in config.outputs) {
        const c = config.outputs[i];
        outputs[i] = outputs[i] || '';
        let status = STATUS.STATUS_WRONG_ANSWER;
        let score = 0;
        if (outputs[i].trim() === (c.output || c[0]).trim()) {
            score = c.score || c[1];
            status = STATUS.STATUS_ACCEPTED;
        }
        totalScore += score;
        totalStatus = Math.max(status, totalStatus);
        next({
            status: totalStatus,
            progress: (100 * (+i + 1)) / config.outputs.length,
            case: {
                status, score, time: 0, memory: 0, message: '',
            },
        }, +i + 1);
    }
    return end({
        status: totalStatus, score: totalScore, time: 0, memory: 0,
    });
}
