import logo from './logo.svg';
import './App.css';
import { getScores } from './api';
import { useState, useEffect } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';
import { Line } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function positionToScore(position) {
  const positions = {
    1: 15,
    2: 12,
    3: 10,
    4: 9,
    5: 8,
    6: 7,
    7: 6,
    8: 5,
    9: 4,
    10: 3,
    11: 2,
    12: 1,
  };

  return positions[position];
}

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

  let evieWin = 0;
  let incWin = 0;
  let eviePodium = 0;
  let incPodium = 0;

  scores.forEach(function (row, i, arr) {
    const previousRow = arr[i - 1];
    const positional = i + 1;

    if (row.inc == 1) {
      incWin++;
    }

    if (row.Evie == 1) {
      evieWin++;
    }

    if (row.Evie < 4) {
      eviePodium++;
    }

    if (row.inc < 4) {
      incPodium++;
    }

    row.incCumScore =
      (previousRow?.incCumScore || 0) + positionToScore(row.inc);

    row.EvieCumScore =
      (previousRow?.EvieCumScore || 0) + positionToScore(row.Evie);

    row.incAveragePlace = (
      ((previousRow?.incAveragePlace || 0) * i + +row.inc) /
      positional
    ).toFixed(2);

    row.EvieAveragePlace = (
      ((previousRow?.EvieAveragePlace || 0) * i + +row.Evie) /
      positional
    ).toFixed(2);
  });

  useEffect(function () {});

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

  const old_data = [
    {
      label: 'React Charts',
      data: [
        {
          date: new Date(),
          stars: 202123,
        },
        // ...
      ],
    },
  ];

  const options = {
    type: 'invertedLine',
    scales: {
      y: { reverse: true },
    },
  };

  const data = {
    labels: scores.map((_, i) => i),
    datasets: [
      {
        label: 'inc average',
        data: scores.map((entry) => entry.incAveragePlace),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointStyle: false,
      },
      {
        label: 'Evie average',
        data: scores.map((entry) => entry.EvieAveragePlace),
        borderColor: 'darkgreen',
        backgroundColor: 'lightgreen',
        pointStyle: false,
      },
      {
        label: 'inc',
        data: scores.map((entry) => entry.inc),
        borderColor: 'grey',
        backgroundColor: 'grey',
        showLine: false,
      },
      {
        label: 'Evie',
        data: scores.map((entry) => entry.Evie),
        borderColor: 'purple',
        backgroundColor: 'purple',
        showLine: false,
      },
    ],
  };

  return (
    <>
      <div style={{ width: 'fit-content' }}>
        <div style={{ width: '1000px' }}>
          <Line data={data} options={options} />
        </div>

        <div>
          <select
            value={chosenCourse}
            onChange={(e) => setChosenCourse(e.target.value)}
          >
            otal games played: 160
            {courseList.map(function (course) {
              return <option value={null}>{course}</option>;
            })}
          </select>
          <select
            value={chosenCC}
            onChange={(e) => setChosenCC(e.target.value)}
          >
            {ccList.map(function (cc) {
              return <option value={null}>{cc}</option>;
            })}
          </select>
          <select
            value={chosenGP}
            onChange={(e) => setChosenGP(e.target.value)}
          >
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
        <br></br>

        <div style={{ overflowY: 'scroll', height: '800px', width: '100%' }}>
          {/* <pre>{JSON.stringify(gameArray[5])}</pre> */}
          <table>
            <tr>
              <th>CC</th>
              <th>GP</th>
              <th>Course</th>
              <th>inc position</th>
              <th>Evie position</th>
              <th>inc score</th>
              <th>Evie score</th>
              <th>inc average position</th>
              <th>Evie average position</th>
            </tr>
            {scores.map(function (entry, i) {
              return (
                <tr key={i} className={i % 2 == 0 ? 'even' : 'odd'}>
                  <td className="align-centre">{entry.CC}</td>
                  <td className="align-centre">{entry.GP}</td>
                  <td className="align-centre">{entry.Course}</td>
                  <td className="align-right">{entry.inc}</td>
                  <td className="align-right">{entry.Evie}</td>
                  <td className="align-right">{entry.incCumScore}</td>
                  <td className="align-right">{entry.EvieCumScore}</td>
                  <td className="align-right">{entry.incAveragePlace}</td>
                  <td className="align-right">{entry.EvieAveragePlace}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>

      <div>
        <p>
          {scores.length === gameArray.length ? 'Total' : 'Selected'} games
          played: {scores.length}
        </p>
        <p>
          Evie 1st positions: <b>{evieWin}</b> (
          {((evieWin / scores.length) * 100).toFixed(2)}%)
        </p>
        <p>
          Evie podium positions: <b>{eviePodium}</b> (
          {((eviePodium / scores.length) * 100).toFixed(2)}%)
        </p>
        <p>
          inc 1st positions: <b>{incWin}</b> (
          {((incWin / scores.length) * 100).toFixed(2)}%)
        </p>
        <p>
          inc podium positions: <b>{incPodium}</b> (
          {((incPodium / scores.length) * 100).toFixed(2)}%)
        </p>
      </div>
    </>
  );
}

export default App;
