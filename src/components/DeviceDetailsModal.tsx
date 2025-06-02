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
    <div className="fixed inset-0 bg-black bg-opacity-50 text-black flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Device Details: {device.Hostname}</h2>

        {/* Lists Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Lists</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Comment</th>
                <th className="border px-4 py-2 text-left">Groups</th>
                <th className="border px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.lists.map((list, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{list.comment || "—"}</td>
                  <td className="border px-4 py-2">
                    {list.groups.map((groupId) =>
                      data.groups.find((g) => g.pi_id === groupId)?.name
                    ).filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="border px-4 py-2">{list.type || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Groups Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Groups</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Comment</th>
                <th className="border px-4 py-2 text-left">Group ID</th>
              </tr>
            </thead>
            <tbody>
              {data.groups.map((group, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{group.name || "—"}</td>
                  <td className="border px-4 py-2">{group.comment || "—"}</td>
                  <td className="border px-4 py-2">{group.pi_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clients Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Clients</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Client</th>
                <th className="border px-4 py-2 text-left">Groups</th>
                <th className="border px-4 py-2 text-left">Client ID</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map((client, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{client.name || "—"}</td>
                  <td className="border px-4 py-2">{client.client || "—"}</td>
                  <td className="border px-4 py-2">
                    {client.groups.map((groupId) =>
                      data.groups.find((g) => g.pi_id === groupId)?.name
                    ).filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="border px-4 py-2">{client.cli_id || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right">
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
