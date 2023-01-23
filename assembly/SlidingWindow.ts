export class SlidingWindow<T> {
    private data: Array<T>;
    private windowSize: i32;
    private formula: (window: Array<T>) => T;
    private cursor: i32;

    constructor(windowSize: i32, formula: (window: Array<T>) => T) {
        if (windowSize < 1) {
            throw new Error("windowSize must be greater than 0");
        }
        if (formula === null) {
            throw new Error("formula function must be provided");
        }
        this.windowSize = windowSize;
        this.formula = formula;
        this.data = new Array<T>(windowSize);
        this.cursor = 0;
    }

    addValue(value: T): void {
        this.data[this.cursor] = value;
        this.cursor = (this.cursor + 1) % this.windowSize;
    }

    getLastValue(): T {
        let index = this.cursor === 0 ? this.windowSize - 1 : this.cursor - 1;
        return this.data[index];
    }

    clear(): void {
        this.data.fill(null);
    }

    setWindowSize(size: i32): void {
        if (size < 1) {
            throw new Error("windowSize must be greater than 0");
        }
        this.windowSize = size;
        this.data = new Array<T>(size);
    }

    getWindow(): Array<T> {
        let result = new Array<T>(this.windowSize);
        for (let i = 0; i < this.windowSize; i++) {
            let index = (this.cursor + i) % this.windowSize;
            result[i] = this.data[index];
        }
        return result;
    }

    getFormulaResult(): T {
        let window = this.getWindow();
        return this.formula(window);
    }
}
