using AppTallerMecanico_BE.Data.Interfaces;
using AppTallerMecanico_BE.Models;
using MySql.Data.MySqlClient;

namespace AppTallerMecanico_BE.Data.Repositories
{
    public class TipoRepository : ITipoRepository
    {
        private readonly string _connectionString;

        public TipoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public IEnumerable<Tipos> GetAllTipos()
        {
            var list = new List<Tipos>();
            using var conn = new MySqlConnection(_connectionString);
            using var cmd = new MySqlCommand("SELECT * FROM Tipos", conn);
            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new Tipos
                {
                    IdTipo = reader.GetInt32(reader.GetOrdinal("id_tipo")),
                    Tipo = reader.GetString(reader.GetOrdinal("nombreTipo")),
                });
            }
            return list;
        }
    }
}
