const assert = require("assert");
const User = require("../models/user");

describe("Deleting a user", () => {
  let louise;
  beforeEach((done) => {
    louise = new User({
      firstName: "Louise",
    });
    louise.save().then(() => done());
  });

  const assertName = (event, done) => {
    event
      .then(() => User.findOne({ firstName: "Louise" }))
      .then((user) => {
        assert(!user);
        done();
      });
  };

  it("model instance remove", (done) => {
    assertName(louise.remove(), done);
  });

  it("class method remove", (done) => {
    assertName(User.deleteMany({ firstName: "Louise" }), done);
  });

  it("class method findOneAndRemove", (done) => {
    assertName(User.findOneAndRemove({ firstName: "Louise" }), done);
  });

  it("class method findByIdAndRemove", (done) => {
    assertName(User.findByIdAndRemove(louise._id), done);
  });
});
