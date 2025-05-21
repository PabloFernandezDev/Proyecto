import React from "react";
import cocheGif from "../assets/gifs/GifDefinitivo.gif";

export const GifAnimacion = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2> Ahora mismo está su coche siendo reparado</h2>
      <img
        src={cocheGif}
        alt="Coche animado"
        style={{ width: "300px", height: "auto"}}
      />
    </div>
  );
};
