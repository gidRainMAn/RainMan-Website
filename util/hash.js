const bcrypt = require("bcrypt");

(async () => {
    const hash = await bcrypt.hash("rain@123", 10);
    console.log(hash);
})();