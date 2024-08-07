import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import OrderAPI from '../api/OrderAPI';
import moment from 'moment';
<<<<<<< HEAD
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
=======
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faUsers, faChartPie } from '@fortawesome/free-solid-svg-icons';
>>>>>>> d9dbff3f58b8125e2b1b03356a1ad272a2ff5ea2

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [countData, setCountData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [categories, setCategories] = useState([]);
<<<<<<< HEAD
=======
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState('day');
  const [percentageChange, setPercentageChange] = useState(0);
  const [amountPercentageChange, setAmountPercentageChange] = useState(0);
  const [courtOrderCounts, setCourtOrderCounts] = useState([]);
>>>>>>> d9dbff3f58b8125e2b1b03356a1ad272a2ff5ea2

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getOrders();
        const ordersWithKeys = fetchedOrders.map((order) => ({
          ...order,
          key: order.orderId,
        }));
        setOrders(ordersWithKeys);

        const totalOrders = fetchedOrders.length;
        const totalOrderAmount = fetchedOrders.reduce((acc, order) => acc + order.amount, 0);

        setTotalCount(totalOrders);
        setTotalAmount(totalOrderAmount);

        calculatePercentageChanges(fetchedOrders);
        calculateCourtOrderCounts(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

<<<<<<< HEAD
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

      countData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
      amountData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

      return { countData, amountData };
    };

    const { countData, amountData } = formatDailyOrdersData();
=======
  const calculatePercentageChanges = (orders) => {
    const startOfCurrentMonth = moment().startOf('month');
    const endOfCurrentMonth = moment().endOf('month');
    const startOfPreviousMonth = moment().subtract(1, 'month').startOf('month');
    const endOfPreviousMonth = moment().subtract(1, 'month').endOf('month');

    const currentMonthOrders = orders.filter(order =>
      moment(order.date).isBetween(startOfCurrentMonth, endOfCurrentMonth, 'day', '[]')
    );
    const previousMonthOrders = orders.filter(order =>
      moment(order.date).isBetween(startOfPreviousMonth, endOfPreviousMonth, 'day', '[]')
    );

    const currentMonthTotal = currentMonthOrders.length;
    const previousMonthTotal = previousMonthOrders.length;

    const currentMonthAmount = currentMonthOrders.reduce((acc, order) => acc + order.amount, 0);
    const previousMonthAmount = previousMonthOrders.reduce((acc, order) => acc + order.amount, 0);

    const percentageChange = previousMonthTotal === 0 ? 0 : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    const amountPercentageChange = previousMonthAmount === 0 ? 0 : ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100;

    setPercentageChange(percentageChange.toFixed(2));
    setAmountPercentageChange(amountPercentageChange.toFixed(2));
  };

  const calculateCourtOrderCounts = (orders) => {
    const courtOrderCounts = {};

    orders.forEach(order => {
      const { courtId, courtName } = order;
      if (courtOrderCounts[courtId]) {
        courtOrderCounts[courtId].count++;
      } else {
        courtOrderCounts[courtId] = { count: 1, name: courtName };
      }
    });

    setCourtOrderCounts(Object.values(courtOrderCounts));
  };

  const formatOrdersData = () => {
    const orderCountsByDate = {};
    const orderAmountsByDate = {};

    orders.forEach((order) => {
      let orderDate;
      if (dateRange === 'day') {
        orderDate = moment(order.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
      } else if (dateRange === 'week') {
        orderDate = moment(order.date, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');
      } else if (dateRange === 'month') {
        orderDate = moment(order.date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
      }

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

    countData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
    amountData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

    return { countData, amountData };
  };

  useEffect(() => {
    const { countData, amountData } = formatOrdersData();
>>>>>>> d9dbff3f58b8125e2b1b03356a1ad272a2ff5ea2
    setCountData(countData);
    setAmountData(amountData);
    setCategories(countData.map((data) => data.date));
  }, [orders, dateRange]);

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
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
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
      curve: 'smooth',
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

  const apexBarOptions = {
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '30%',
            },
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '20%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: 0,
      labels: {
        colors: '#A3AED0',
      },
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="ml-5 mr-5" >
      <div className="flex justify-center mb-4 pt-4">
        <button onClick={() => setDateRange('day')} className={`px-4 py-2 ${dateRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Day</button>
        <button onClick={() => setDateRange('week')} className={`px-4 py-2 mx-2 ${dateRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Week</button>
        <button onClick={() => setDateRange('month')} className={`px-4 py-2 ${dateRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Month</button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex-1 p-4 bg-white rounded shadow mr-2">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faUsers} className="text-blue-500 mr-2" />
            <h4 className="text-lg font-semibold">Total Orders Count</h4>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{totalCount.toLocaleString()}</p>
            <p className={`ml-2 text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{percentageChange}% {percentageChange >= 0 ? '↑' : '↓'}</p>
          </div>
        </div>

        <div className="flex-1 p-4 bg-white rounded shadow ml-2">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faMoneyBill} className="text-blue-500 mr-2" />
            <h4 className="text-lg font-semibold">Total Revenue Amount</h4>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
            <p className={`ml-2 text-sm ${amountPercentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{amountPercentageChange}% {amountPercentageChange >= 0 ? '↑' : '↓'}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex-1 mr-2">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-primary">Order Count</h3>
            </div>
            <div className="overflow-hidden">
              <ReactApexChart
                options={apexOptions}
                series={[{ name: 'Order Count', data: countData.map((data) => data.orders) }]}
                type="area"
                height={350}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 ml-2">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-primary">Order Amount</h3>
            </div>
            <div className="overflow-hidden">
              <ReactApexChart
                options={apexBarOptions}
                series={[{ name: 'Amount', data: amountData.map((data) => data.amount) }]}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      <div className="mt-4">
        <p className="text-sm">Order Count - Oldest Date: {oldestCountDate}</p>
        <p className="text-sm">Order Count - Newest Date: {newestCountDate}</p>
        <p className="text-sm">Order Amount - Oldest Date: {oldestAmountDate}</p>
        <p className="text-sm">Order Amount - Newest Date: {newestAmountDate}</p>
=======


      <div className="w-full p-4 bg-white rounded shadow mt-6">

        <h4 className="text-lg font-semibold mb-2"><FontAwesomeIcon icon={faChartPie} className="text-blue-500 mr-2" />Order Distribution by Court</h4>
        <ReactApexChart
          options={{
            chart: {
              type: 'pie',
              height: 400,
            },
            labels: courtOrderCounts.map(court => court.name),
            legend: {
              position: 'bottom',
            },
          }}
          series={courtOrderCounts.map(court => court.count)}
          type="pie"
          height={400}
        />
>>>>>>> d9dbff3f58b8125e2b1b03356a1ad272a2ff5ea2
      </div>
    </div>
  );
};

export default Dashboard;
