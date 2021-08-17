const { addTutor, getStudents } = require("./index");

describe("adding a tutor", () => {
  it("should not add tutor if tutor is empty string", () => {
    const result = addTutor(["tutorA", "tutorB"], "");
    expect(result).toEqual(["tutorA", "tutorB"]);
  });

  it("should not add tutor if tutor is a whitespace", () => {
    const result = addTutor(["tutorA", "tutorB"], " ");
    expect(result).toEqual(["tutorA", "tutorB"]);
  });
});

describe("get common students", () => {
  it("should return an empty array for empty tutors", () => {
    expect(() => getStudents([])).rejects.toEqual({
      response: {
        status: 400,
        data: {
          message: "Validation failed",
          details: "Tutor is required.",
        },
      },
    });
  });
});
