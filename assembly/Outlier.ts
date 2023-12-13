export class OutlierHelper {
    static filterOutliers(data: f64[]): f64[] {
        const sorted = data.slice().sort((a, b) => a - b);
        const q1 = this.quantile(sorted, 0.25);
        const q3 = this.quantile(sorted, 0.75);
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        return sorted.filter((x) => x >= lowerBound && x <= upperBound);
    }

    private static quantile(sortedData: f64[], q: f64): f64 {
        const pos = (sortedData.length - 1) * q;
        const base = i32(Math.floor(pos));
        const rest = pos - f64(base);

        if (base + 1 < sortedData.length) {
            return sortedData[base] + rest * (sortedData[base + 1] - sortedData[base]);
        } else {
            return sortedData[base];
        }
    }

    static adjustOutliers(data: f64[]): f64[] {
        const medianValue = this.median(data);
        const q1 = this.quantile(data, 0.25);
        const q3 = this.quantile(data, 0.75);
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        let adjustedData: f64[] = new Array<f64>(data.length);
        for (let i = 0; i < data.length; i++) {
            adjustedData[i] = (data[i] < lowerBound || data[i] > upperBound) ? medianValue : data[i];
        }

        return adjustedData;
    }

    private static median(data: f64[]): f64 {
        const sorted = data.slice().sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
        const mid = sorted.length / 2;
        return sorted.length % 2 !== 0 ? sorted[i32(Math.floor(mid))] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
}
