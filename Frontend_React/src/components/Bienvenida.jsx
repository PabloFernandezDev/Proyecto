import React, { useState } from "react";
export const Bienvenida = () => {

    const imagen = "https://picsum.photos/200/300?RANDOM=5";

  return (
    <div className="bienvenida">
        <div className="contenido">
            <figcaption style={{width: "60%"}}>
                <img src={imagen} alt="imagen" className="imagen"/>
            </figcaption>
            <div className="contenido__texto">
                <h2>Bienvenido</h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam rerum
                voluptate totam doloribus, nihil soluta nam qui nesciunt, eius in
                laborum quo consectetur architecto sequi accusantium necessitatibus
                cumque. Vero, fugiat.
            </div>
        </div>
    </div>
  );
};
