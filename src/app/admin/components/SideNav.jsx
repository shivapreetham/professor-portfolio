import { Layers3, Brush, BarChart, Settings } from "lucide-react";

function SideNav() {
  const menuList = [
    { id: 1, name: "Pages", icon: Layers3 },
    { id: 2, name: "Style", icon: Brush },
    { id: 3, name: "Stats", icon: BarChart },
    { id: 4, name: "Settings", icon: Settings },
  ];

  return (
    <div className="p-4 bg-[#00000052] h-screen flex flex-col justify-between">
      <div>
        {menuList.map((menu, index) => (
          <div
            key={index}
            className="p-2 py-4 rounded-lg bg-primary flex items-center justify-center mb-5 cursor-pointer tooltip-secondary tooltip tooltip-right"
            data-tip={menu.name}
          >
            <menu.icon className="text-white text-center" size={24} />
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 px-4">
      </div>
    </div>
  );
}

export default SideNav;