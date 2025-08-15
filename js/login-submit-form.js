import express from 'express';
import { urlencoded } from 'body-parser';
const app = express();
const port = 3000;

app.use(urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.post('/login_submit_form', (req, res) => {
  const id = req.body.userid;
  const password = req.body.password;

  console.log('받은 데이터:', { id, password });
  res.send('데이터가 성공적으로 처리되었습니다.');
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});