function measure(fn) {
    let start = performance.now();
    fn();
    return performance.now() - start;
}

module.exports = measure;