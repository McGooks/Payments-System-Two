const assert = require("assert");
const User = require("../models/user");

describe("Creating Records", () => {
  it("saves a user", (done) => {
    const louise = new User({
      firstName: "Louise",
    });
    louise.save()
          .then(() => {
              //Has Joe been save correctly?
              assert(!louise.isNew)
              done()
          })
  });
});
