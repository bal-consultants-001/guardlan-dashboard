// components/DeviceDetailsModal.tsx
import React from "react";

export default function DeviceDetailsModal({ device, onClose, data }: {
  device: any;
  onClose: () => void;
  data: {
    lists: any[];
    groups: any[];
    clients: any[];
  };
}) {
  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Device Details: {device.name}</h2>

        <div className="mb-4">
          <h3 className="font-semibold">Groups</h3>
          <ul className="list-disc ml-5">
            {data.groups.map((group, i) => (
              <li key={i}>{group.name}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Clients</h3>
          <ul className="list-disc ml-5">
            {data.clients.map((client, i) => (
              <li key={i}>{client.client}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Lists</h3>
          <ul className="list-disc ml-5">
            {data.lists.map((list, i) => (
              <li key={i}>{list.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
