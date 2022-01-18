"use strict";

const { DateTime } = require("luxon");
const path = require("path");
const fs = require("fs");

const DATE_FORMAT = process.env.DATE_FORMAT || "yyyyMMddHHmmss";

exports.create = function (config, name) {
  const now = DateTime.now();
  const templateFile = path.join(__dirname, config.MIGRATIONS_TEMPLATE);
  const targetFilename = `${now.toFormat(DATE_FORMAT)}-${name}.js`;
  const targetFilePath = path.join(
    __dirname,
    `../${config.MIGRATIONS_DIR}/${targetFilename}`
  );

  fs.copyFile(templateFile, targetFilePath, (err) => {
    if (err) throw err;
    console.log(`Migration file ${targetFilename} created`);
  });
};
