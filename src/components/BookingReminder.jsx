import React, { useState } from "react";

const BookingReminder = ({ booking }) => {
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad

  if (!booking) return null; // Si no hay turno, no mostramos nada

  const formatDate = (date) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
      "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
    ];

    const day = days[date.getDay()];
    const number = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return { day, number, month, year };
  };

  const bookingDate = new Date(booking.originalStartTime);
  const { day, number, month, year } = formatDate(bookingDate);

  // Función para ocultar el recordatorio
  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div
        className="booking-reminder"
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
          padding: "10px",
          width: "90%", 
          maxWidth: "400px",
          margin: "10px auto", 
          display: "flex",
          flexDirection: "column", 
          gap: "10px",
          animation: "slideDown 0.5s ease-out", // Animación de deslizamiento
        }}
      >
        {/* Contenedor del Título centrado */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2
            style={{
              color: "#104DBA", 
              fontSize: "20px", 
              fontWeight: "bold",
              textAlign: "center", 
              opacity: 0,
              animation: "fadeIn 1s ease-in forwards 0.3s", // Animación de desvanecimiento
            }}
          >
            Recordatorio de turno
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "stretch",
          }}
        >
          {/* Bloque de la fecha */}
          <div
            style={{
              backgroundColor: "#104DBA",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: "90px", // Asegurar ancho constante
              opacity: 0,
              animation: "fadeIn 1s ease-in forwards 0.5s", // Animación de desvanecimiento
            }}
          >
            <div style={{ fontSize: "14px" }}>{day}</div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>{number}</div>
            <div style={{ fontSize: "14px" }}>
              {month} {year}
            </div>
          </div>

          {/* Bloque de datos */}
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              opacity: 0,
              animation: "fadeIn 1s ease-in forwards 0.7s", // Animación de desvanecimiento
            }}
          >
            {/* Datos principales */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#104DBA" }}>
                Hora:{" "}
                {bookingDate.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                hs
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 0" }}>
                🏥 {booking.centerName || "Zona Med"}
              </div>
            </div>

            {/* Datos del paciente y doctor y botón cancelar */}
            <div style={{ marginTop: "auto" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: "#555",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {booking.patientName}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#555",
                  textTransform: "uppercase",
                }}
              >
                Doctor: {booking.doctorName}
              </div>

              {/* Botón Cancelar */}
              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <button
                  style={{
                    backgroundColor: "#104DBA",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "12px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                  onClick={handleCancel} // Al hacer clic, se oculta el recordatorio
                >
                  ENTENDIDO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BookingReminder;
