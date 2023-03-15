import logo from './logo.svg';
import './App.css';
import { getScores } from './api';
import { useState, useEffect, react } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';

function App() {
  const [gameArray, setGameArray] = useState([]);
  const [csvContent, setCsvContent] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);

  const scores = gameArray.filter(function (row) {
    if (!chosenCourse) {
      return true;
    }
    return row.Course === chosenCourse;
  });

  useEffect(
    function () {
      const getCourses = new Set(
        gameArray
          .map(function (row) {
            return row.Course;
          })
          .sort()
      );
      console.log(getCourses);
      setCourseList([...getCourses]);
    },
    [gameArray]
  );

  useEffect(() => {
    async function fetchData() {
      const tmpScores = await getScores();
      setCsvContent(tmpScores);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const parsedScores = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
    setGameArray(parsedScores);
  }, [csvContent]);

  // console.log(gameArray);
  console.log(chosenCourse);
  return (
    <>
      <div
        style={{ overflowY: 'scroll', height: '500px', width: 'fit-content' }}
      >
        {/* <pre>{JSON.stringify(gameArray[5])}</pre> */}
        <table>
          <tr>
            <th>Course</th>
            <th>CC</th>
            <th>GP</th>
            <th>inc</th>
            <th>Evie</th>
          </tr>
          {scores.map(function (entry, i) {
            return (
              <tr key={i}>
                <td>{entry.Course}</td>
                <td>{entry.CC}</td>
                <td>{entry.GP}</td>
                <td>{entry.inc}</td>
                <td>{entry.Evie}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div>
        <select
          value={chosenCourse}
          onChange={(e) => setChosenCourse(e.target.value)}
        >
          {courseList.map(function (course) {
            return <option value={null}>{course}</option>;
          })}
        </select>
        <select>
          <option value="fruit">Fruit</option>
          <option value="vegetable">Vegetable</option>
          <option value="meat">Meat</option>
        </select>
      </div>
    </>
  );
}

export default App;
