import logo from './logo.svg';
import './App.css';
import { getScores } from './api';
import { useState, useEffect } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';

function App() {
  const [gameArray, setGameArray] = useState([]);
  const [csvContent, setCsvContent] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);
  const [chosenCC, setChosenCC] = useState(null);
  const [ccList, setCCList] = useState([]);
  const [chosenGP, setChosenGP] = useState(null);
  const [gpList, setGPList] = useState([]);

  // Search query trigger for Course
  const scores = gameArray
    .filter(function (row) {
      if (!chosenCourse || chosenCourse === '--All courses--') {
        return true;
      }
      return row.Course === chosenCourse;
    })
    .filter(function (row) {
      if (!chosenCC || chosenCC === '--All CC--') {
        return true;
      }
      return row.CC === chosenCC;
    })
    .filter(function (row) {
      if (!chosenGP || chosenGP === '--All GP--') {
        return true;
      }
      return row.GP === chosenGP;
    });

  // Getting all queries from the csv course column
  useEffect(
    function () {
      const getCourses = new Set(
        gameArray
          .map(function (row) {
            return row.Course;
          })
          .sort()
      );

      const getCC = new Set(
        gameArray
          .map(function (roww) {
            return roww.CC;
          })
          .sort()
      );

      const getGP = new Set(
        gameArray
          .map(function (row) {
            return row.GP;
          })
          .sort()
      );

      console.log(getCourses);
      setCourseList(['--All courses--'].concat([...getCourses]));
      setCCList(['--All CC--'].concat([...getCC]));
      setGPList(['--All GP--'].concat([...getGP]));
    },
    [gameArray]
  );

  // Getting data from the api
  useEffect(() => {
    async function fetchData() {
      const tmpScores = await getScores();
      setCsvContent(tmpScores);
    }
    fetchData();
  }, []);

  // Parses data to JSON to be iterated
  useEffect(() => {
    const parsedScores = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
    setGameArray(parsedScores);
  }, [csvContent]);

  // console.log(gameArray);
  // console.log(chosenCourse);

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
        <select value={chosenCC} onChange={(e) => setChosenCC(e.target.value)}>
          {ccList.map(function (cc) {
            return <option value={null}>{cc}</option>;
          })}
        </select>
        <select value={chosenGP} onChange={(e) => setChosenGP(e.target.value)}>
          {gpList.map(function (gp) {
            return <option value={null}>{gp}</option>;
          })}
        </select>
        {/* <select>
          <option value="fruit">Fruit</option>
          <option value="vegetable">Vegetable</option>
          <option value="meat">Meat</option>
        </select> */}
      </div>
    </>
  );
}

export default App;
