/**
 * @param {function(*, *): boolean} comparator function that returns if 2
 *     elements are equal
 * @constructor
 */
export function LinkedList(comparator) {
    /**
     * @param {*} value
     * @param {LinkedList.Node | null} next
     * @param {LinkedList.Node | null} prev
     * @constructor
     */
    this.Node = function(value, next = null, prev = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    };

    this.comparator = comparator;
    /** @type {LinkedList.Node | null} */
    this.head = null;
    /** @type {LinkedList.Node | null} */
    this.tail = null;
    this.length = 0;
}

/**
 * inserts an item at the beginning of the list
 * @param {*} value
 */
LinkedList.prototype.unshift = function(value) {
    const node = new this.Node(value, this.head);

    if (this.length++ === 0)
        this.tail = node;
    else
        this.head.prev = node;

    this.head = node;
};

/**
 * Removes the last item and returns it
 * @returns {*}
 */
LinkedList.prototype.pop = function() {
    if (this.length === 0) return;
    const popped = this.tail;

    if (this.length === 1) {
        this.head = null;
        this.tail = null;
    }
    else {
        let prev = this.tail.prev;
        prev.next = null;
        this.tail = prev;
    }

    --this.length;
    return popped.value;
};

/**
 * @param {*} target
 * @param {number} startAt (must be less than length) index to start searching
 * @return {boolean}
 */
LinkedList.prototype.includes = function(target, startAt = 0) {
    let node = this.head;
    for (let i = 0; i < startAt; ++i)
        node = node.next;

    if (typeof (this.comparator) != 'undefined') {
        while (node != null) {
            if (this.comparator(node.value, target))
                return true;
            node = node.next;
        }
    }
    else {
        while (node != null) {
            if (node.value === target)
                return true;
            node = node.next;
        }
    }
    return false;
};

/**
 * Adds an element to the end of the list
 * @param {*} value
 */
LinkedList.prototype.push_back = function(value) {
    const node = new this.Node(value, null, this.tail);

    if (this.length === 0)
        this.head = node;
    else
        this.tail.next = node;

    this.tail = node;
};

/**
 * @param {function(*): void} callback
 */
LinkedList.prototype.forEach = function(callback) {
    let node = this.head;
    while (node != null) {
        callback(node.value);
        node = node.next;
    }
};