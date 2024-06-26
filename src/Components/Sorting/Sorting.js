import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, setOrder } from "../../Actions/courses.actions";
import "./Sorting.css";

const Sorting = ({ setlimite, valor }) => {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.filters);

  const handleOrder = (e) => {
    // dispatch(setOrder(e.target.value))
    setlimite(valor);
    dispatch(setOrder(e.target.value));
    dispatch(getCourses({ order: e.target.value, category }));
  };
  return (
    <section className="sorting">
      <select
        onChange={handleOrder}
        className="sorting_rating-sort-selector selector"
      >
        <option defaultValue="">Ordenar Calificación</option>
        <option value="maxR">Mayor Calificación</option>
        <option value="minR">Menor Calificación</option>
      </select>

      <select
        onChange={handleOrder}
        className="sorting_price-sort-selector selector"
      >
        <option value="">Ordenar Precios</option>
        <option value="maxP">Mayor Precio</option>
        <option value="minP">Menor Precio</option>
      </select>
    </section>
  );
};

export default Sorting;
