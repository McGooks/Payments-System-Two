import React from "react";
//Navigation
import NavButtonAbout from "../../components/layouts/NavButtonAbout";

const About = () => {
  return (
    <div>
          <NavButtonAbout/>
      <h1>About this app</h1>
      <p>
        This is a full stack react app created by Glenn Marshall-Adams
      </p>
      <p>This app has been designed as part of an MSc Project and is intended to manage the tracking of payments for Queens University Belfast</p>
      <p>
        <strong>Version: </strong> 1.0.0
      </p>
    </div>
  );
};

export default About;
