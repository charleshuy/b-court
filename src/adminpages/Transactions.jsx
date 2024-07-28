import moment from "moment";
import { useEffect, useState } from "react";
import OrderAPI from "../api/OrderAPI"; // Ensure the correct path

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"];

    const showFiltersAndApply = (params) => {
        applyFilter(params);
        setFilterParam(params);
    };

    const removeAppliedFilter = () => {
        removeFilter();
        setFilterParam("");
        setSearchText("");
    };

    useEffect(() => {
        if (searchText === "") {
            removeAppliedFilter();
        } else {
            applySearch(searchText);
        }
    }, [searchText]);

    return (
        <div className="inline-block float-right">
            <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input input-bordered mr-4"
            />
            {filterParam !== "" && (
                <button
                    onClick={removeAppliedFilter}
                    className="btn btn-xs btn-active btn-ghost mr-2"
                >
                    {filterParam} <span className="ml-2">✕</span>
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    Filter ▼
                </label>
                <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                    {locationFilters.map((location, index) => (
                        <li key={index}>
                            <a onClick={() => showFiltersAndApply(location)}>{location}</a>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li>
                        <a onClick={removeAppliedFilter}>Remove Filter</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

function Transactions({ userId }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const fetchedTransactions = await OrderAPI.getOrdersByUserId(userId); // Use the passed userId prop
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        };

        fetchTransactions();
    }, [userId]);

    const removeFilter = () => {
        // Call the fetchTransactions again to reset the transactions
        const fetchTransactions = async () => {
            try {
                const fetchedTransactions = await OrderAPI.getOrdersByUserId(userId);
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        };

        fetchTransactions();
    };

    const applyFilter = (params) => {
        const filteredTransactions = transactions.filter(
            (t) => t.location === params
        );
        setTransactions(filteredTransactions);
    };

    const applySearch = (value) => {
        const filteredTransactions = transactions.filter(
            (t) =>
                t.email.toLowerCase().includes(value.toLowerCase()) ||
                t.name.toLowerCase().includes(value.toLowerCase())
        );
        setTransactions(filteredTransactions);
    };

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow mt-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                    <TopSideButtons
                        applySearch={applySearch}
                        applyFilter={applyFilter}
                        removeFilter={removeFilter}
                    />
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Id</th>
                                <th>Location</th>
                                <th>Amount</th>
                                <th>Transaction Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    <img src={transaction.avatar} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{transaction.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{transaction.email}</td>
                                    <td>{transaction.location}</td>
                                    <td>${transaction.amount}</td>
                                    <td>{moment(transaction.date).format("D MMM")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Transactions;
