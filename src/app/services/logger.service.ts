import { Injectable } from '@angular/core';
import { Log } from '../model/log';

@Injectable()
export class LoggerService {

    public logs = Array<Log>();

    constructor() {
    }

    public writeLog(log: Log) {

        this.logs.push(log);

    }

    public clearLogs() {

        this.logs = [];

    }
    
}
