import _ from "lodash";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback, useEffect, useState } from "react";
import { addTutor, getStudents } from "../helpers";

export default function Home() {
  const [tutorInput, setTutorInput] = useState("");
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const onTutorAdded = useCallback(() => {
    const result = addTutor(tutors, tutorInput);
    setTutors(result);
  }, [tutors, tutorInput]);

  const onTutorClcked = useCallback(
    (tutor) => {
      setTutors(tutors.filter((t) => t != tutor));
    },
    [tutors]
  );

  const onSendClicked = useCallback(() => {
    setIsLoadingStudents(true);
    getStudents(tutors)
      .then((res) => {
        setStudents(res.data.students);
        toast.success("Students loaded.", { autoClose: true });
      })
      .catch((err) => {
        if (_.isNil(err.response)) {
          toast.error("No response received from the server. Is it even on?", {
            autoClose: true,
          });
          return;
        }

        switch (err.response.status) {
          case 400:
          case 404:
            const details = _.isArray(err.response.data.details)
              ? "An invalid email was received."
              : err.response.data.details;
            toast.warning(details, { autoClose: true });
            return;
          case 500:
            toast.error(
              "Something went wrong in the server. Please try again.",
              { autoClose: true }
            );
            return;
        }
      }).finally(() => {
        setIsLoadingStudents(false);
      })
  }, [tutors]);

  useEffect(() => {
    setTutorInput("");
  }, [tutors]);

  return (
    <>
      <Head>
        <title>Student management</title>
      </Head>
      <main className="w-full flex flex-col p-8">
        <ToastContainer />
        <container className="w-full lg:w-1/2 flex flex-col justify-between m-auto bg-blue">
          <h1 className="text-gray-600 text-5xl mb-12 font-bold">Student Management</h1>
          <header className="w-full flex  flex-col">
            <div className="flex flex-col lg:flex-row justify-between items-stretch mb-4">
              <div className="flex flex-col lg:flex-row mb-4 lg:mb-0">
                <input
                  className="bg-gray-100 shadow-inner text-xl px-4 py-2  rounded mr-0 lg:mr-4 mb-4 lg:mb-0"
                  placeholder="Tutor name"
                  value={tutorInput}
                  onChange={(v) => setTutorInput(v.currentTarget.value)}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      onTutorAdded();
                    }
                  }}
                />
                <button
                  className="bg-black text-white px-8 py-2 font-bold  rounded h-full"
                  onClick={onTutorAdded}
                >
                  Add
                </button>
              </div>
              <div>
                {isLoadingStudents ? (
                  <p className="text-xl text-blue-400 font-bold tracking-wider">Loading...</p>
                ) : (
                  <button
                    className="bg-blue-200 text-xl px-8 py-2 font-bold rounded w-full lg:w-auto"
                    onClick={onSendClicked}
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-row flex-wrap">
              {tutors.map((t) => (
                <p key={`tutor-${t}`}
                  className="rounded-full shadow bg-gray-100 mr-6 py-2 px-8 cursor-pointer mb-4"
                  onClick={() => onTutorClcked(t)}
                >
                  {t}
                </p>
              ))}
            </div>
          </header>
          {students.length ? (
            <content className="w-full py-12">
              <table className="w-full lg:w-auto">
                <tr>
                  <th className="text-3xl text-left text-gray-600 ">Students</th>
                </tr>
                {students.map((s) => (
                  <tr key={`student-${s}`} className="border-b border-gray-300">
                    <td className="py-4 text-xl text-gray-600">{s}</td>
                  </tr>
                ))}
              </table>
            </content>
          ) : null}
        </container>
      </main>
    </>
  );
}
