using AppTallerMecanico_BE.Data.Interfaces;
using AppTallerMecanico_BE.Models;
using MySql.Data.MySqlClient;
using System.Xml.Linq;

namespace AppTallerMecanico_BE.Data.Repositories
{
    public class RepuestoRepository : IRepuestoRepository
    {
        private readonly string _connectionString;
        public RepuestoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<Repuestos> GetAllRepuestos()
        {
            var list = new List<Repuestos>();
            using var conn = new MySqlConnection(_connectionString);
            using var cmd = new MySqlCommand("SELECT r.codigo,t.nombreTipo,m.nombreMarca,r.nombre," +
                                            "r.medidas,CONCAT('$ ',r.precioUnitario) AS precioUnitario,r.cantidad " +
                                            "FROM Repuestos r JOIN Marcas m ON r.id_marca  = m.id_marca JOIN Tipos t " +
                                            "ON r.id_tipo = t.id_tipo order by r.nombre asc", conn);
            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new Repuestos
                {                  
                    Codigo = reader.GetString(reader.GetOrdinal("codigo")),
                    Marca = reader.GetString(reader.GetOrdinal("nombreMarca")),
                    Tipo = reader.GetString(reader.GetOrdinal("nombreTipo")),
                    Nombre = reader.GetString(reader.GetOrdinal("nombre")),
                    Medida = reader.GetString(reader.GetOrdinal("medidas")),
                    PrecioUnitario = reader.GetDouble(reader.GetOrdinal("precioUnitario")),
                    Stock = reader.GetInt32(reader.GetOrdinal("cantidad"))
                });
            }
            return list;
        }

        public bool UpdateRepuesto(UpdateRepuesto repuesto)
        {
            using var conn = new MySqlConnection(_connectionString);
            using var cmd = new MySqlCommand(
                "UPDATE Repuestos SET nombre = @nombre, precioUnitario = @precioUnitario, cantidad = @cantidad " +
                "WHERE codigo = @codigo", conn);

            cmd.Parameters.AddWithValue("@nombre", repuesto.Nombre);
            cmd.Parameters.AddWithValue("@precioUnitario", repuesto.Precio);
            cmd.Parameters.AddWithValue("@cantidad", repuesto.Cantidad);
            cmd.Parameters.AddWithValue("@codigo", repuesto.Codigo);

            conn.Open();
            cmd.ExecuteNonQuery();
            return true;
        }
    }
}
