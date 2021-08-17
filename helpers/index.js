const _ = require("lodash");
const axios = require("axios");

function addTutor(existingTutors, newTutor) {
  const tutor = newTutor.trim();
  if (!tutor) {
    return existingTutors;
  }

  return [...existingTutors, tutor];
}

function getStudents(tutors) {
  if (_.isNil(tutors) || _.isEmpty(tutors)) {
    return Promise.reject({
        response: {
            status: 400,
            data: {
                message: "Validation failed",
                details: "Tutor is required."
            }
        }
    });
  }

  return axios.get("http://localhost:4000/api/getcommonsstudents", {
    params: { tutor: tutors },
  });
}

module.exports = { addTutor, getStudents };
