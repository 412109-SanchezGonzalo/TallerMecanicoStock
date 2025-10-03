using AppTallerMecanico_BE.Data.Interfaces;
using AppTallerMecanico_BE.Models;
using MySql.Data.MySqlClient;

namespace AppTallerMecanico_BE.Data.Repositories
{
    public class MarcaRepository : IMarcaRepository
    {
        private readonly string _connectionString;

        public MarcaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<Marcas> GetAllMarcas()
        {
            var list = new List<Marcas>();
            using var conn = new MySqlConnection(_connectionString);
            using var cmd = new MySqlCommand("SELECT * FROM Marcas", conn);
            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new Marcas
                {
                    IdMarca = reader.GetInt32(reader.GetOrdinal("id_marca")),
                    Marca = reader.GetString(reader.GetOrdinal("nombreMarca")),
                });
            }
            return list;
        }
    }
}
