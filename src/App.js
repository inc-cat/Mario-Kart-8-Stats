import logo from './logo.svg';
import './App.css';
import { getScores } from './api';
import { useState, useEffect } from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table';

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

  return (
    <div style={{ overflowY: 'scroll', height: '400px', width: 'fit-content' }}>
      <CsvToHtmlTable
        data={csvContent}
        csvDelimiter=","
        tableClassName="Mario Kart 8"
        hasHeader={true}
      />
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
