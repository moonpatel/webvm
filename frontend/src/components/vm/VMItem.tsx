import { VM } from "@/types";
import { DistroIcons } from "../icons";

interface VMItemProps {
  vm: VM;
}

export function VMItem({ vm }: VMItemProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow flex space-x-4">
      <img className="block w-20" src={DistroIcons[vm.type]} alt="Distro logo" />
      <div>
        <div className="font-medium text-2xl text-gray-800">{vm.name}</div>
        <div className="text-gray-800/75">{vm.type}</div>
      </div>
    </div>
  );
}
