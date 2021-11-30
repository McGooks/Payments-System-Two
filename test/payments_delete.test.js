const assert = require("assert");
const Payments = require("../models/payments");

describe("Deleting a user", () => {
  let payment;
  beforeEach((done) => {
    payment = new Payments({
      amount: "146.50",
    });
    payment.save().then(() => done());
  });

  const assertName = (event, done) => {
    event
      .then(() => Payments.findOne({ amount: "146.50" }))
      .then((payments) => {
        assert(!payments);
        done();
      });
  };

  it("model instance remove", (done) => {
    assertName(payment.remove(), done);
  });

  it("class method remove", (done) => {
    assertName(Payments.deleteMany({ amount: "146.50" }), done);
  });

  it("class method findOneAndRemove", (done) => {
    assertName(Payments.findOneAndRemove({ amount: "146.50" }), done);
  });

  it("class method findByIdAndRemove", (done) => {
    assertName(Payments.findByIdAndRemove(payment._id), done);
  });
});
