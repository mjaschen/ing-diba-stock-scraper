const config = require('config');
const fs     = require('fs');
const system = require('system');
const utils  = require('utils');

var quotes      = [];
var quotes_csv  = "";
var now         = Math.floor(Date.now() / 1000);
var filename    = "data/quotes-" + now.toString() + ".txt";

var casper = require('casper').create({
    clientScripts: [
        "node_modules/jquery/dist/jquery.js"
    ],
    viewportSize: {
        width: 1280,
        height: 900
    },
    pageSettings: {
         loadImages:  true,
         loadPlugins: false,
         userAgent: "User-Agent Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/603.1.3 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7"
    },
    onResourceRequested : function(C, requestData, request) {
        // utils.dump(requestData);
    },
    onResourceReceived: function(C, response) {
        // utils.dump(response.headers);
    }
});

// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.start(config.url);

casper.wait(500);

casper.then(function () {
    this.evaluate(function (login, password) {
        $("input[type=text]", "ul.MyInvestorLogin").val(login);
        $("input[type=password]", "ul.MyInvestorLogin").val(password);
        $("input[type=checkbox]", "ul.MyInvestorLogin li.shRememberMe").prop("checked", true);
    }, config.login, config.password);
});

casper.then(function () {
    this.evaluate(function () {
        $("input[type=submit]", "ul.MyInvestorLogin").click();
    });
});

casper.wait(2000);

casper.then(function () {
    quotes = this.evaluate(function () {
        var quotes = [];
        $("tr", "table.watchlist").each(function(idx, elem) {
            var $tr = $(elem);
            var $tr_next = $tr.next("tr.second");
            if (! $tr.hasClass("first")) {
                return
            }
            quotes.push({
                id:             $("td.right span.tooltip", $tr).attr("itemid"),
                isin:           $("td.isin", $tr_next).text(),
                name:           $("td.name span.tooltip", $tr).text(),
                count:          $tr.children("td").eq(1).children("span").first().text(),
                quote_watch:    $("td.watchPrice span.tooltip", $tr).text(),
                quote_current:  $("td.currentPrice span.tooltip", $tr).text(),
            });
         })

        return quotes;
    });
});

casper.then(function () {
    quotes_csv += "timestamp;id;isin;name;count;quote_watch;quote_current\n";
    for (var idx = 0; idx < quotes.length; idx ++) {
        quotes_csv += now + ";"
            + quotes[idx].id + ";"
            + quotes[idx].isin + ";"
            + quotes[idx].name + ";"
            + quotes[idx].count + ";"
            + quotes[idx].quote_watch + ";"
            + quotes[idx].quote_current
            + "\n";
    }

    console.log(quotes_csv);

    fs.write(filename, quotes_csv, 'w');
});

casper.run();
