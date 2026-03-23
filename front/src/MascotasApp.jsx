import { useState, useEffect } from "react";
import { read, create, update, deleteM } from "./services/api";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import toast, { Toaster } from "react-hot-toast";

export default function MascotasApp({ onLogout }) {
  const [mascotas, setMascotas] = useState([]);
  
  // Estado inicial centralizado para limpiar fácilmente el formulario
  const estadoInicial = {
    nombre: "",
    especie: "",
    edad: "",
    foto: null,
    foto_para_binario: null,
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [cargandoTabla, setCargandoTabla] = useState(false);
  const [cargandoGuardar, setCargandoGuardar] = useState(false);
  const [erroresBackend, setErroresBackend] = useState({});

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    setCargandoTabla(true);
    try {
      const respuesta = await read();
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar mascotas:", error);
      toast.error("Error al obtener los datos del servidor");
    } finally {
      setCargandoTabla(false);
    }
  };

  const handleChange = (e) => {
    // Si el input es un archivo, guardamos el objeto File en lugar del string de la ruta
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //NO SE RECARGE LA PAGINA, ONEPAGE
    setCargandoGuardar(true);
    setErroresBackend({});

    // Simulamos un pequeño retraso para ver el estado de carga (opcional)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Empaquetamos todo en FormData porque estamos enviando archivos
    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.nombre);
    dataToSend.append("especie", formData.especie);
    dataToSend.append("edad", formData.edad);
    
    // Solo enviamos las fotos si el usuario seleccionó un archivo nuevo
    if (formData.foto instanceof File) {
      dataToSend.append("foto", formData.foto);
    }
    if (formData.foto_para_binario instanceof File) {
      dataToSend.append("foto_para_binario", formData.foto_para_binario);
    }

    try {
      if (editandoId) {
        await update(editandoId, dataToSend);
        toast.success("Mascota actualizada correctamente");
      } else {
        await create(dataToSend);
        toast.success("Mascota registrada exitosamente");
      }

      // Limpiamos los inputs de texto en el estado
      setFormData(estadoInicial);
      setEditandoId(null);
      // Limpiamos visualmente los inputs de tipo archivo en el DOM
      document.getElementById("form-mascotas").reset(); 
      cargarMascotas();

    } catch (error) {
      console.error("Error al guardar:", error);
      if (error.response && error.response.data) {
        setErroresBackend(error.response.data);
        toast.error("Por favor, corrige los errores en el formulario");
      } else {
        toast.error("Hubo un error de conexión con el servidor");
      }
    } finally {
      setCargandoGuardar(false);
    }
  };

  const prepararEdicion = (mascota) => {
    setFormData({
      nombre: mascota.nombre,
      especie: mascota.especie,
      edad: mascota.edad,
      foto: null, // Evitamos cargar archivos viejos, obligamos a subir nuevos si edita
      foto_para_binario: null,
    });
    setEditandoId(mascota.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta mascota?")) {
      const toastId = toast.loading("Eliminando mascota...");
      try {
        await deleteM(id);
        toast.success("Mascota eliminada", { id: toastId });
        cargarMascotas();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar la mascota", { id: toastId });
      }
    }
  };

  const mascotasFiltradas = mascotas.filter(
    (mascota) =>
      mascota.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      mascota.especie.toLowerCase().includes(filtro.toLowerCase()),
  );

  const barraDeBusqueda = (
    <div className="input-group mb-3" style={{ maxWidth: "300px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar nombre o especie..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      {filtro && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setFiltro("")}
        >
          ✖
        </button>
      )}
    </div>
  );

  const SpinnerTabla = () => (
    <div className="p-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2 text-muted">Cargando registros...</p>
    </div>
  );

  const columnas = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Especie", selector: (row) => row.especie, sortable: true },
    { name: "Edad", selector: (row) => row.edad, sortable: true },
    {
      name: "Foto (Media)",
      cell: (row) => 
        row.foto ? (
          <img 
            src={row.foto} 
            alt="Carpeta Media" 
            width="50" 
            height="50" 
            style={{ objectFit: 'cover', borderRadius: '5px' }} 
          />
        ) : "N/A"
    },
    {
      name: "Foto (Binario)",
      cell: (row) => 
        row.foto_base64_display ? (
          <img 
            src={row.foto_base64_display} 
            alt="Base de Datos" 
            width="50" 
            height="50" 
            style={{ objectFit: 'cover', borderRadius: '5px' }} 
          />
        ) : "N/A"
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => prepararEdicion(row)}
            disabled={cargandoTabla}
          >
            ✏️ Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleEliminar(row.id)}
            disabled={cargandoTabla}
          >
            🗑️ Eliminar
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="container mt-5">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="text-primary mb-0">Gestión de Mascotas</h2>
        <button 
          onClick={onLogout} 
          className="btn btn-outline-danger fw-bold"
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {editandoId ? "Editar Mascota" : "Registrar Mascota"}
              </h5>
            </div>
            <div className="card-body">
              {/* Le agregamos el ID para poder hacer el .reset() en el submit */}
              <form id="form-mascotas" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${erroresBackend.nombre ? "is-invalid" : ""}`}
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled={cargandoGuardar}
                  />
                  {erroresBackend.nombre && (
                    <div className="invalid-feedback">
                      {erroresBackend.nombre.join(", ")}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Especie</label>
                  <input
                    type="text"
                    name="especie"
                    placeholder="Ej. perro, gato"
                    className={`form-control ${erroresBackend.especie ? "is-invalid" : ""}`}
                    value={formData.especie}
                    onChange={handleChange}
                    required
                    disabled={cargandoGuardar}
                  />
                  {erroresBackend.especie && (
                    <div className="invalid-feedback">
                      {erroresBackend.especie.join(", ")}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    name="edad"
                    className={`form-control ${erroresBackend.edad ? "is-invalid" : ""}`}
                    value={formData.edad}
                    onChange={handleChange}
                    required
                    disabled={cargandoGuardar}
                  />
                  {erroresBackend.edad && (
                    <div className="invalid-feedback">
                      {erroresBackend.edad.join(", ")}
                    </div>
                  )}
                </div>

                {/* Input para la foto que se guarda en la carpeta media */}
                <div className="mb-3">
                  <label className="form-label">Foto (Carpeta Media)</label>
                  <input
                    type="file"
                    name="foto"
                    accept="image/jpeg"
                    className={`form-control ${erroresBackend.foto ? "is-invalid" : ""}`}
                    onChange={handleChange}
                    disabled={cargandoGuardar}
                  />
                  {erroresBackend.foto && (
                    <div className="invalid-feedback">
                      {erroresBackend.foto.join(", ")}
                    </div>
                  )}
                </div>

                {/* Input para la foto que se guarda como bytes en la base de datos */}
                <div className="mb-3">
                  <label className="form-label">Foto (Base de Datos)</label>
                  <input
                    type="file"
                    name="foto_para_binario"
                    accept="image/jpeg"
                    className={`form-control ${erroresBackend.foto_para_binario ? "is-invalid" : ""}`}
                    onChange={handleChange}
                    disabled={cargandoGuardar}
                  />
                  {erroresBackend.foto_para_binario && (
                    <div className="invalid-feedback">
                      {erroresBackend.foto_para_binario.join(", ")}
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={cargandoGuardar}
                  >
                    {cargandoGuardar ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Guardando...
                      </>
                    ) : editandoId ? (
                      "Actualizar"
                    ) : (
                      "Guardar"
                    )}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditandoId(null);
                        setFormData(estadoInicial);
                        setErroresBackend({});
                        document.getElementById("form-mascotas").reset();
                      }}
                      disabled={cargandoGuardar}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-0 pt-3">
              <DataTable
                title="Lista de Mascotas"
                columns={columnas}
                data={mascotasFiltradas}
                pagination
                paginationPerPage={5}
                highlightOnHover
                responsive
                subHeader
                subHeaderComponent={barraDeBusqueda}
                subHeaderAlign="right"
                noDataComponent="No hay mascotas que coincidan con la búsqueda"
                progressPending={cargandoTabla}
                progressComponent={<SpinnerTabla />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}