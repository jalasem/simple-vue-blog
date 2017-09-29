const express = require('express'),
  app = express();

app.use(express.static('./public'));

app.listen(3000, () => {
  console.log("app running on port 3000");
})