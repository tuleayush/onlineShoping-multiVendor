const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("customer")
        .readOwn("user")
        .updateOwn("user")
        .readAny("product")
        .readAny("category")
        .readAny("subcategory")

        .createOwn()

    ac.grant("staff")
        .extend("customer")
        .readAny("user")

    ac.grant("admin")
        .extend("customer")
        .extend("staff")
        .updateAny("user")
        .deleteAny("user")

    return ac;
})();