var express = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
//var QRCode = require('qrcode');
//const nodemailer = require("nodemailer");
var router = express.Router();
const dbutils = require('./api_dbutils.js');

router.post('/api/newsourceurl', function (req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
      dbutils.insertSourceUrl(fields.friendlyname, fields.url, fields.indexfilter)
  });
  res.end()
});

router.get('/api/opml', function (req, res) {
  var ids = dbutils.getOpml();
  var xml = `<opml version="2.0">
	<body>
		<outline text="Subscriptions" title="Subscriptions">`

  for(i = 0; i<ids.length; i++){
    var newoutline = "<outline xmlUrl='http://vx-labs.org/feeds/" + ids[i].id + ".xml' />"
    xml+=newoutline;
  }
  xml+=`</outline>
	</body>
</opml>
`
res.send(xml)
});


module.exports = router;