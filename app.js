const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const root_dir = require("./utils/path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(root_dir, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(root_dir, "views", "404.html"));
});

app.listen(3000);
