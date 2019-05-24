import { Log, LogType } from '../../model/log';

describe('Logs tests', () => {

    it('should create a log', () => {
        const log = new Log("Test log", new Date(), LogType.INFOS);
        expect(log.text).toBe("Test log");
    });

    it('should create a typed log', () => {
        const log = new Log("Test log", new Date(), LogType.INFOS);
        expect(log.type).toBe(LogType.INFOS);
    });

});
