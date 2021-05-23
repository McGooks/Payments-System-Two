const assert = require("assert");
const User = require("../models/user");

describe("Reading users out of the database", () => {
  let louise, glenn, mark, gary;

  beforeEach((done) => {
    mark = new User({ firstName: "mark" });
    glenn = new User({ firstName: "glenn" });
    louise = new User({ firstName: "louise" });
    gary = new User({ firstName: "gary" });

    Promise.all([louise.save(), glenn.save(), gary.save(), mark.save()]).then(() =>
      done()
    );
  });

  it("finds alls users with the firstName louise", () => {
    User.find(
      {
        firstName: "louise",
      },
      (err, docs) => {
        if (err) {
          console.log(`Error: ` + err);
        } else {
          if (docs.length === 0) {
            console.log("No Records Exist");
          }
        }
      }
    ).then((users) => {
      assert(users[0]._id.toString() === louise._id.toString()); //consideration needs to be given that the _id may be an object
      done();
    });
  });

  it("find a user with a specific ID", (done) => {
    User.findOne({
      _id: louise._id,
    }).then((user) => {
      assert(user.firstName === "louise");
      done();
    });
  });

  it("can skip and limit the result set", (done) => {
    User.find({})
      .sort({ firstName: 1 })
      .skip(1)
      .limit(2)
      .then((users) => {
        assert(users.length == 2);
        assert(users[0].firstName === "louise");
        assert(users[1].firstName === "glenn");
        done();
      });
  });
});
