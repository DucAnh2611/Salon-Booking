class Observable {
    constructor() {
        this.observers = {}
    }

    on(input, observer) {
        if(!this.observers[input]) this.observers[input] = [];
        this.observers[input].push(observer);
    }

    triggerInput(input, params) {
        this.observers[input].forEach(o => {
            o.apply(null, params);
        });
    }
}

module.exports = Observable;