import logo from './logo.svg';
import './App.css';
import { getScores } from './api';
import { useState, useEffect } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';

function App() {
  const [gameArray, setGameArray] = useState([]);
  const [csvContent, setCsvContent] = useState('');

  useEffect(() => {
    async function fetchData() {
      const tmpScores = await getScores();
      console.log(tmpScores);
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

  console.log(gameArray);
  return (
    <div style={{ overflowY: 'scroll', height: '500px', width: 'fit-content' }}>
      {/* <pre>{JSON.stringify(gameArray[5])}</pre> */}
      <table>
        <tr>
          <th>Course</th>
          <th>CC</th>
          <th>GP</th>
          <th>inc</th>
          <th>Evie</th>
        </tr>
        {gameArray.map(function (entry) {
          return (
            <tr>
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
  );
}

export default App;
