import React, { useContext, useEffect, useReducer } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Tableau de bord</h1>
      {loading ? (
        <p>Veuillez patienter...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <section>
            <article>
              <div>
                <div>
                  <p>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0} Clients</p>
                </div>
              </div>
            </article>
            <article>
              <div>
                <div>
                  <p>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0} Orders</p>
                </div>
              </div>
            </article>
            <article>
              <div>
                <div>
                  <p>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0} € de Commandes</p>
                </div>
              </div>
            </article>
          </section>
          <section className="my-3">
            <h2>Ventes</h2>
            {summary.dailyOrders.length === 0 ? (
              <p>Aucune Vente</p>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Chargement du graphique...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </section>
          <section className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <p>Aucune Catégorie</p>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Chargement du graphique...</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </section>
        </>
      )}
    </div>
  );
}