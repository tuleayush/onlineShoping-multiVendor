const Sequence = require('../models/Sequence');

module.exports = {
    async generateSequenceFromType(type, incrementBy = 1) {
        let { count, prefix, fill, minLength } = await Sequence.findOneAndUpdate(
            { type },
            { $inc: { count: incrementBy } },
            { new: true }
        );
        return `${prefix}${(count + 1).toString().padStart(minLength, fill)}`;
    },
    async generateBulkSequenceFromType(type, totalLength) {
        let { count, prefix, fill, minLength } = await Sequence.findOneAndUpdate(
            { type },
            { $inc: { count: totalLength } },
            { new: true }
        );

        const toReturn = Array
            .from(
                { length: totalLength },
                () => `${prefix}${(count--).toString().padStart(minLength, fill)}`
            );

        return toReturn;
    }
};