import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import OrderAPI from '../api/OrderAPI';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faUsers } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [countData, setCountData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState('day'); // Default is day

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getOrders();
        const ordersWithKeys = fetchedOrders.map((order) => ({
          ...order,
          key: order.orderId,
        }));
        setOrders(ordersWithKeys);

        const totalOrders = fetchedOrders.length; // Calculate total count
        const totalOrderAmount = fetchedOrders.reduce((acc, order) => acc + order.amount, 0); // Calculate total amount

        setTotalCount(totalOrders); // Set total count in state
        setTotalAmount(totalOrderAmount); // Set total amount in state
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

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
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={() => setDateRange('day')} className={`px-4 py-2 ${dateRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Day</button>
        <button onClick={() => setDateRange('week')} className={`px-4 py-2 ${dateRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Week</button>
        <button onClick={() => setDateRange('month')} className={`px-4 py-2 ${dateRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Month</button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 mr-2 p-4 bg-white rounded shadow">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faUsers} className="text-blue-500 mr-2" />
            <h4 className="text-lg font-semibold">Total Orders Count</h4>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{totalCount.toLocaleString()}</p>
            <p className="ml-2 text-green-500 text-sm">0.43% ↑</p>
          </div>
        </div>
        <div className="w-1/2 ml-2 p-4 bg-white rounded shadow">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faMoneyBill} className="text-blue-500 mr-2" />
            <h4 className="text-lg font-semibold">Total Revenue Amount</h4>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
            <p className="ml-2 text-green-500 text-sm">0.43% ↑</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex-1 mr-2">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-primary" style={{ width: '20%' }}>Order Count</h3>
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
    </div>
  );
};

export default Dashboard;
