const isArray = (item) => {
    if(!Array.isArray) {
        return Object.prototype.toString.call(item) === "[object Array]";
    }
    return Array.isArray(item);
};

export default isArray;
