import logo from './logo.svg';
import './App.css';
import { getScores } from './api';
import { useState, useEffect } from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table';
import { parse } from 'csv-parse';

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

  const parsedScores = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return (
    <div style={{ overflowY: 'scroll', height: '400px', width: 'fit-content' }}>
      {/* <CsvToHtmlTable
        data={csvContent}
        csvDelimiter=","
        tableClassName="Mario Kart 8"
        hasHeader={true}
      /> */}

      <pre>{parsedScores[0]}</pre>
      {/* 
      <table style="width:100%">
        <tr>
          <th>Company</th>
          <th>Contact</th>
          <th>Country</th>
        </tr>
      </table> */}
    </div>
  );
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
