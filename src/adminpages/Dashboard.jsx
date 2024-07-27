import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import OrderAPI from '../api/OrderAPI';
import moment from 'moment';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [countData, setCountData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getOrders();
        setOrders(
          fetchedOrders.map((order) => ({ ...order, key: order.orderId }))
        ); // Ensure each order has a key
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const formatDailyOrdersData = () => {
      const orderCountsByDate = {};
      const orderAmountsByDate = {};

      orders.forEach((order) => {
        const orderDate = moment(order.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        if (orderCountsByDate[orderDate]) {
          orderCountsByDate[orderDate] += 1;
          orderAmountsByDate[orderDate] += order.amount;
        } else {
          orderCountsByDate[orderDate] = 1;
          orderAmountsByDate[orderDate] = order.amount;
        }
      });

      const countData = Object.keys(orderCountsByDate).map((date) => ({
        date,
        orders: orderCountsByDate[date],
      }));

      const amountData = Object.keys(orderAmountsByDate).map((date) => ({
        date,
        amount: orderAmountsByDate[date],
      }));

      // Sort data by date
      countData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
      amountData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

      return { countData, amountData };
    };

    const { countData, amountData } = formatDailyOrdersData();
    setCountData(countData);
    setAmountData(amountData);
    setCategories(countData.map((data) => data.date));
  }, [orders]);

  const apexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },

    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },

      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
    },
  };

  const chartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Date: ${label}`}</p>
          <p>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <div className="col-span-12 rounded-sm border border-stroke items-center bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
              <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                <div className="flex min-w-47.5">
                  <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-cyan-400">
                    <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-cyan-400"></span>
                  </span>
                  <div className="w-full">
                    <p className="font-semibold text-primary">Total Book Count</p>
                    <p className="text-sm font-medium" style={{ width: '150%' }}>12.04.2022 - 12.05.2022</p>
                  </div>


                </div>
              </div>
            </div>
            <div id="chartOne" className="-ml-5">
              <ReactApexChart
                options={apexOptions}
                series={[{ name: 'Order Count', data: countData.map((data) => data.orders) }]}
                type="area"
                height={350}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <h3>Order Count</h3>
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={amountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip content={chartTooltip} />
              <Line type="monotone" dataKey="amount" stroke="#ff4d4f" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <h3>Order Amount</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
