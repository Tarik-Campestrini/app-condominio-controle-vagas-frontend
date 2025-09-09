import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/vagas", label: "Vagas" },
    { path: "/moradores", label: "Moradores" },
    { path: "/veiculos", label: "Veículos" },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">
        Controle de Vagas
      </h1>

      <div className="flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-lg font-medium transition 
              ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
