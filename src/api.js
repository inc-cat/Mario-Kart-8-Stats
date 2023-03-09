import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

export async function getScores() {
  try {
    const res = await api.get('data/mk8.csv');
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
