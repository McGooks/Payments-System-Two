const assert = require("assert");
const Payments = require("../models/payments");

describe("Creating Records", () => {
    it("saves a user", (done) => {
      const payment = new Payments({
        amount: "146.50",
      });
      payment.save()
            .then(() => {
                //Has Joe been save correctly?
                assert(!payment.isNew)
                done()
            })
    });
  });
  