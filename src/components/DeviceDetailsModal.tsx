'use client';

import React from "react";
import { DeviceWithLog, DeviceList, DeviceGroup, DeviceClient } from "@/types";

interface DeviceDetailsModalProps {
  device: DeviceWithLog;
  data: {
    lists: DeviceList[];
    groups: DeviceGroup[];
    clients: DeviceClient[];
  };
  onClose: () => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ device, data, onClose }) => {
  if (!device) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Device Details: {device.Hostname}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Groups */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Groups:</h3>
            <ul className="list-disc list-inside">
              {data.groups.length > 0 ? (
                data.groups.map((group, index) => (
                  <li key={index}>{group.name || "Unnamed group"}</li>
                ))
              ) : (
                <li>No groups found</li>
              )}
            </ul>
          </div>

          {/* Clients */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Clients:</h3>
            <ul className="list-disc list-inside">
              {data.clients.length > 0 ? (
                data.clients.map((client, index) => (
                  <li key={index}>{client.name || client.client}</li>
                ))
              ) : (
                <li>No clients found</li>
              )}
            </ul>
          </div>

          {/* Lists */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Lists:</h3>
            <ul className="list-disc list-inside">
              {data.lists.length > 0 ? (
                data.lists.map((list, index) => (
                  <li key={index}>{list.type || list.comment}</li>
                ))
              ) : (
                <li>No lists found</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsModal;
