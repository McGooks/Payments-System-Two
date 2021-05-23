const assert = require("assert");
const User = require("../models/user");

describe("Updating a user", () => {
  let louise;
  // Creates test record
  beforeEach((done) => {
    louise = new User({
      firstName: "louise",
      payments: 0,
    });
    louise.save().then(() => done());
  });

  function assertName(event, done) {
    event
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].firstName === "mark");
        done();
      });
  }

  it("instance type using set & save", (done) => {
    louise.set("firstName", "mark");
    assertName(louise.save(), done);
  });

  it("instance type using update", (done) => {
    assertName(louise.updateOne({ firstName: "mark" }), done);
  });

  it("class method update", (done) => {
    assertName(User.updateMany({ firstName: "louise" }, { firstName: "mark" }), done);
  });

  it("class method findOneAndUpdate", (done) => {
    assertName(User.findOneAndUpdate({ firstName: "louise" }, { firstName: "mark" }), done);
  });

  it("class method findByIdAndUpdate", (done) => {
    assertName(User.findByIdAndUpdate(louise._id, { firstName: "mark" }), done);
  });

  it("user can have their like count incremented by one", (done) => {
    User.updateMany({ firstName: "louise" }, { $inc: { payments: 1 } })
      .then(() => User.findOne({ firstName: "louise" }))
      .then((user) => {
        assert(user.payments === 1);
        done();
      });
  });
});
