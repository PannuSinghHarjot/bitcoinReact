import React, { useState, useEffect } from "react";
import { Card, Dimmer, Loader, Select } from "semantic-ui-react";
import "./App.css";
import Chart from "react-apexcharts";


const dataApi = {
  time: {
    updated: "Aug 26, 2020 02:44:00 UTC",
    updatedISO: "2020-08-26T02:44:00+00:00",
    updateduk: "Aug 26, 2020 at 03:44 BST",
  },
  disclaimer:
    "This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
  chartName: "Bitcoin",
  bpi: {
    USD: {
      code: "USD",
      symbol: "&#36;",
      rate: "113,386.4127",
      description: "United States Dollar",
      rate_float: 11386.4127,
    },
    GBP: {
      code: "GBP",
      symbol: "&pound;",
      rate: "8,698.8891",
      description: "British Pound Sterling",
      rate_float: 8698.8891,
    },
    EUR: {
      code: "EUR",
      symbol: "&euro;",
      rate: "9,653.5943",
      description: "Euro",
      rate_float: 9653.5943,
    },
  },
};

function getAgenda(){
  return new Promise(function(resolve, reject){
      setTimeout(function(){
          resolve(dataApi);
      }, 1000);
  });
}



const API_URL = "https://api.coindesk.com/v1/bpi/currentprice.json";
const API_DATA = "https://api.coindesk.com/v1/bpi/historical/close.json";

function App() {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState(null);

  const options = [
    {
      value: "USD",
      text: "USD",
    },
    {
      value: "EUR",
      text: "EUR",
    },
    {
      value: "GBP",
      text: "GBP",
    },
  ];

  useEffect(() => {
    async function fetchData() {
     const res = await fetch(API_URL);
    // const res = await getAgenda()
      const data = await res.json();
      setCurrency(data.bpi.USD.code);
      setPriceData(data.bpi);
      getChartData();
    }
    fetchData();
  }, []);

  const handleSelect = (e, data) => {
    setCurrency(data.value);
  };
  const getChartData = async () => {
    const res = await fetch(API_DATA)
    const data = await res.json()
    const categories = Object.keys(data.bpi)
    const series = Object.values(data.bpi)
    setChartData({
      xaxis: {
        categories: categories
      }
    })
    setSeries([
     {
       name: 'Bitcoin Price',
       data: series
     }
    ])
    setLoading(false)
  }



  return (
    <div className="App">
      <div className="nav" style={{ padding: 15, backgroundColor: "gold" }}>
        CoinDesk API DATA
      </div>
      <div >
        {loading ? (
          <div>
            <Dimmer active inverted>
              <Loader> Loading...</Loader>
            </Dimmer>
          </div>
        ) : (
          <>
            <div
              className="price-container"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: 600,
                height: 300,
                margin: "0 auto",
              }}
            >
              <div className="form">
                <Select
                  placeholder="Select Currency"
                  onChange={handleSelect}
                  options={options}
                ></Select>
              </div>
              <div className="price">
                <Card>
                  <Card.Content>
                    <Card.Header>{currency} Currency</Card.Header>
                    <Card.Description>
                      {priceData[currency].rate}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </div>
            
            </div>
            <div id="chartData">
            <Chart className="char" options={chartData} series={series} type="line" width="1200" height="300" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
