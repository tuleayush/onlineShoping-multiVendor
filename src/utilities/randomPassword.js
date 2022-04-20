module.exports = {
    generateRandomPassword: () => {
        let randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
    }
};