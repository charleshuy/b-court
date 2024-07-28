import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import OrderAPI from '../api/OrderAPI';
import moment from 'moment';
<<<<<<< HEAD
=======
import CourtAPI from '../api/CourtAPI';
import {FaRegCalendarMinus} from 'react-icons/fa';

>>>>>>> 11f7d202c02cbc87874d164396de82f9c92b3761


const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [countData, setCountData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalAccounts, setTotalAccounts] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getOrders();
        setOrders(
          fetchedOrders.map((order) => ({ ...order, key: order.orderId }))
        );
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const fetchedTotalAccounts = await CourtAPI.getTotalAccounts();
        setTotalAccounts(fetchedTotalAccounts);

        const fetchedTotalAmount = await OrderAPI.getTotalAmount();
        setTotalAmount(fetchedTotalAmount);
      } catch (error) {
        console.error('Failed to fetch totals:', error);
      }
    };

    fetchTotals();
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

      countData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
      amountData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

      return { countData, amountData };
    };

    const { countData, amountData } = formatDailyOrdersData();
    setCountData(countData);
    setAmountData(amountData);
    setCategories(countData.map((data) => data.date));
  }, [orders]);

  const getOldestAndNewestDates = (data) => {
    if (data.length === 0) return { oldest: null, newest: null };

    const dates = data.map(item => moment(item.date));
    const oldestDate = moment.min(dates).format('YYYY-MM-DD');
    const newestDate = moment.max(dates).format('YYYY-MM-DD');

    return { oldest: oldestDate, newest: newestDate };
  };
  const { oldest: oldestCountDate, newest: newestCountDate } = getOldestAndNewestDates(countData);
  const { oldest: oldestAmountDate, newest: newestAmountDate } = getOldestAndNewestDates(amountData);

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
        <div className="flex-1 mr-2">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-center mb-4">

              <h3 className="font-semibold text-primary" style={{ width: '20%' }}>Order Count</h3>
              <p className="text-sm font-medium">{oldestCountDate} - {newestCountDate}</p>
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
              <p className="text-sm font-medium">{oldestAmountDate} - {newestAmountDate}</p>
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

=======
      <div className="mt-4">
        <p className="text-sm">Order Count - Oldest Date: {oldestCountDate}</p>
        <p className="text-sm">Order Count - Newest Date: {newestCountDate}</p>
        <p className="text-sm">Order Amount - Oldest Date: {oldestAmountDate}</p>
        <p className="text-sm">Order Amount - Newest Date: {newestAmountDate}</p>
      </div>
      <div className="grid grid-cols-2 gap-[30px] mt-[25px] pb-[15px]">
        <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4e73df] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
          <div>
            <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">Total Account</h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">{totalAccounts}</h1>
          </div>
          <FaRegCalendarMinus fontSize={28} color="" />
        </div>
        <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4e73df] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
          <div>
            <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">Total Amount</h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">{totalAmount}</h1>
          </div>
          <FaRegCalendarMinus fontSize={28} color="" />
        </div>
      </div>
>>>>>>> 11f7d202c02cbc87874d164396de82f9c92b3761
    </div>
  );
};

export default Dashboard;
