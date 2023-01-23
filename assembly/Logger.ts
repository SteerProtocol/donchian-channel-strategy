declare function log(s: string): void;

export class Logger {
    constructor() {}

    static log(s: string): void {
        log(s);
    }
}

