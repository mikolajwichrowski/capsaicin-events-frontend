export const count = function (ary, classifier) {
    classifier = classifier || String

    if (!ary) {
        return {}
    }

    return ary.reduce(function (counter, item) {
        const p = classifier(item)
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1
        return counter
    }, {})
}
