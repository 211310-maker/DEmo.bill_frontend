import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { LOCAL_STORAGE_KEY } from "../constants";
import { getAllBillsApi } from "../utils/api";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

      if (!user || !user.token) {
        console.warn("No user token found → bills cannot load");
        setLoading(false);
        return;
      }

      const { data, error } = await getAllBillsApi();

      // 🔥 Make frontend BULLET-PROOF:
      if (!data || !data.success) {
        console.warn("Bills API error:", error || "Unknown error");
        setBills([]);
        setLoading(false);
        return;
      }

      setBills(data.bills || []);
      setLoading(false);
    } catch (err) {
      console.error("Bills load exception:", err);
      setBills([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Header />
      <div className="text-center mt-4">
        <p className="login-heading">
          <b>BILL REPORTS</b>
        </p>
      </div>

      <div className="box box--main">
        <div className="box__heading--blue">Generated Bills</div>

        {loading ? (
          <p className="text-center mt-4">Loading…</p>
        ) : bills.length === 0 ? (
          <p className="text-center mt-4">No bills found.</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Vehicle No</th>
                <th>State</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.vehicleNo}</td>
                  <td>{bill.state}</td>
                  <td>{bill.totalAmount}</td>
                  <td>
                    {new Date(bill.createdAt).toLocaleDateString()}{" "}
                    {new Date(bill.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL}/bill/${bill._id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <br />
      <br />
      <br />
    </>
  );
};

export default Bills;
