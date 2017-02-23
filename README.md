# ING DiBa Stock Watchlist Scraper

A script which uses CasperJS and PhantomJS to scrape the contents of a ING DiBa stock watchlist into a CSV file.

Optionally, you can enable `prom` output in the config file and then it generates a metrics file for [Prometheus](http://prometheus.io).

## Prerequisites

- create stock watchlist at [ING DiBa website](https://wertpapiere.ing-diba.de/DE/Showpage.aspx?pageID=71)
- add some stocks to watchlist

## Installation

- install [PhantomJS](http://phantomjs.org/download.html)
- `git clone https://github.com/mjaschen/ing-diba-stock-scraper.git`
- `cd ing-diba-stock-scraper`
- `make install`
- edit `config.js` (fill in `login` and `password` values)
- verify/update file permissions of `config.js` (you may want to remove file permissions for everyone but yourself)

## Starting a scrape

- `make`

The current values of the watchlist will be saved as a CSV file in the `data` sub-directory.

The script is quite silent with default settings, but it's possible to make it more chatty:

- `make CASPERJS_OPTION_LOG_LEVEL="debug" CASPERJS_OPTION_VERBOSE="--verbose"`

## Example of CSV output

```csv
timestamp;id;isin;name;count;quote_watch;quote_current
1472978211;24299486;NL0000235190;Airbus Group;250 St.;57,479 EUR;53,011 EUR
```

## Example of prom output

```
#HELP stock_price The stock price, either watched or current
#HELP stock_count The number of stocks in the watchlist
#TYPE stock_price gauge
#TYPE stock_count gauge
stock_price{type="current",id="23590133",isin="US88160R1014",name="Tesla",currency="EUR"} 260.82
stock_price{type="watch",id="23590133",isin="US88160R1014",name="Tesla",currency="EUR"} 197.586
stock_count{id="23590133",isin="US88160R1014",name="Tesla"} 1
stock_price{type="current",id="23561025",isin="DE0005089031",name="United Internet",currency="EUR"} 39.231
stock_price{type="watch",id="23561025",isin="DE0005089031",name="United Internet",currency="EUR"} 13.114
stock_count{id="23561025",isin="DE0005089031",name="United Internet"} 2
```

## Example of Prometheus query to see the current value of all the stocks with a specific ISIN:
```
stock_count{isin="US88160R1014"} * on(id, name, isin) stock_price{type="current",isin="US88160R1014"}
```

